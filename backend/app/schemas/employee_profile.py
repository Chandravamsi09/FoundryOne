from pydantic import BaseModel, EmailStr
from typing import Optional

class EmployeeProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None

class EmployeeProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    status: str

    class Config:
        orm_mode = True
