from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.schemas.task import TaskResponse, TaskUpdate
from app.schemas.project import ProjectResponse

router = APIRouter()
employee_only = Depends(require_role(["employee"]))

@router.get("/dashboard", dependencies=[employee_only])
async def get_employee_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve assigned tasks count
    tasks_query = select(Task).where(Task.assignee_id == current_user.id)
    result = await db.execute(tasks_query)
    tasks = result.scalars().all()
    
    return {
        "totalAssignedTasks": len(tasks),
        "pendingTasks": len([t for t in tasks if t.status in ["TODO", "IN_PROGRESS"]]),
        "completedTasks": len([t for t in tasks if t.status == "COMPLETED"])
    }

@router.get("/tasks", response_model=List[TaskResponse], dependencies=[employee_only])
async def get_assigned_tasks(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).where(Task.assignee_id == current_user.id)
    if status:
        query = query.where(Task.status == status)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/tasks/{task_id}/status", response_model=TaskResponse, dependencies=[employee_only])
async def update_task_status(
    task_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Task).where(Task.id == task_id, Task.assignee_id == current_user.id))
    task = result.scalars().first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
        
    task.status = status
    await db.commit()
    await db.refresh(task)
    return task
