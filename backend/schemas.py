from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class ProgramBase(BaseModel):
    title: str
    description: str
    category: str
    date: str
    time: str
    venue: str
    organizer: str
    seats: int
    status: str = "Approved"

class ProgramCreate(ProgramBase):
    pass

class Program(ProgramBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class RegistrationBase(BaseModel):
    program_id: str

class Registration(RegistrationBase):
    id: str
    user_id: str
    status: str
    created_at: datetime
    program: Program

    class Config:
        from_attributes = True
