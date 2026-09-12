from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "planning"
    progress: Optional[float] = 0.0
    deadline: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    organization_id: UUID
    manager_id: Optional[UUID] = None
    client_id: Optional[UUID] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[float] = None
    deadline: Optional[datetime] = None
    manager_id: Optional[UUID] = None
    client_id: Optional[UUID] = None

class ProjectResponse(ProjectBase):
    id: UUID
    organization_id: UUID
    manager_id: Optional[UUID] = None
    client_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
