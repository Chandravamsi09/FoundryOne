from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class OrganizationBase(BaseModel):
    name: str
    industry: Optional[str] = None
    size: Optional[str] = None
    status: Optional[str] = "active"

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    status: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
