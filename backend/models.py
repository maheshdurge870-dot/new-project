
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base
import datetime

import uuid

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    FACULTY = "FACULTY"
    STUDENT = "STUDENT"
    VOLUNTEER = "VOLUNTEER"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String, default=RoleEnum.STUDENT)
    is_active = Column(Boolean, default=True)

class Program(Base):
    __tablename__ = "programs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    date = Column(String)
    time = Column(String)
    venue = Column(String)
    organizer = Column(String)
    seats = Column(Integer)
    status = Column(String, default="Approved")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Registration(Base):
    __tablename__ = "registrations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"))
    program_id = Column(String, ForeignKey("programs.id"))
    status = Column(String, default="Registered")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User")
    program = relationship("Program")
