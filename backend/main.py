import os
from typing import Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jwt

import models
import schemas
from database import engine, get_db, SQLALCHEMY_DATABASE_URL

try:
    models.Base.metadata.create_all(bind=engine)
    print(f"[DB] Connected: {SQLALCHEMY_DATABASE_URL[:60]}...")
except Exception as e:
    print(f"[DB] WARNING: Could not create tables — {e}")
    print("[DB] Server will start, but DB operations will fail until connection is fixed.")


app = FastAPI(title="CampusEvent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Loaded from backend/.env — never hardcode these!
SECRET_KEY = os.getenv("SECRET_KEY", "change_me_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Supabase credentials (available for direct Supabase client usage if needed)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.on_event("startup")
def populate_mock_data():
    db = next(get_db())
    if not db.query(models.User).first():
        users = [
            models.User(email="admin@campusevent.com", name="Admin User", hashed_password=get_password_hash("password"), role="ADMIN"),
            models.User(email="faculty@campusevent.com", name="Faculty User", hashed_password=get_password_hash("password"), role="FACULTY"),
            models.User(email="student@campusevent.com", name="Student User", hashed_password=get_password_hash("password"), role="STUDENT"),
            models.User(email="volunteer@campusevent.com", name="Volunteer User", hashed_password=get_password_hash("password"), role="VOLUNTEER"),
        ]
        db.add_all(users)
        
        programs = [
            models.Program(title="AI & Machine Learning Workshop", description="Learn AI basics.", category="Workshop", date="2026-10-15", time="10:00", venue="Main Auditorium", organizer="CS Dept", seats=100),
            models.Program(title="Web Development Bootcamp", description="React & Vite.", category="Technical", date="2026-10-20", time="09:00", venue="Lab 1", organizer="IT Dept", seats=50),
        ]
        db.add_all(programs)
        db.commit()

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    user_schema = schemas.User.model_validate(user)
    return {"access_token": access_token, "token_type": "bearer", "user": user_schema}

@app.get("/programs", response_model=list[schemas.Program])
def get_programs(db: Session = Depends(get_db)):
    return db.query(models.Program).all()

@app.post("/programs", response_model=schemas.Program)
def create_program(program: schemas.ProgramCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["ADMIN", "FACULTY"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_program = models.Program(**program.model_dump())
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    return db_program

@app.post("/programs/{program_id}/register")
def register_program(program_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    program = db.query(models.Program).filter(models.Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    existing = db.query(models.Registration).filter(
        models.Registration.program_id == program_id,
        models.Registration.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
        
    registration = models.Registration(user_id=current_user.id, program_id=program_id)
    db.add(registration)
    db.commit()
    return {"message": "Registration successful"}

@app.get("/registrations", response_model=list[schemas.Registration])
def get_my_registrations(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Registration).filter(models.Registration.user_id == current_user.id).all()

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_programs = db.query(models.Program).count()
    total_users = db.query(models.User).filter(models.User.role == 'STUDENT').count()
    total_registrations = db.query(models.Registration).count()
    
    return {
        "total_programs": total_programs,
        "total_students": total_users,
        "total_registrations": total_registrations,
        "active_volunteers": db.query(models.User).filter(models.User.role == 'VOLUNTEER').count()
    }
