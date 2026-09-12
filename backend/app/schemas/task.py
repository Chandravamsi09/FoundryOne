from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "TODO"
    priority: Optional[str] = "MEDIUM"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    project_id: UUID
    assignee_id: Optional[UUID] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[UUID] = None

class TaskResponse(TaskBase):
    id: UUID
    project_id: UUID
    assignee_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
