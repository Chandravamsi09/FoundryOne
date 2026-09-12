from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    user: Optional[dict] = None
    role: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class LoginCredentials(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None
    rememberMe: Optional[bool] = False

class RegisterData(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    confirmPassword: str
    role: str
