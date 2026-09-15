from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, or_

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.organization import Organization
from app.schemas.project import ProjectResponse, ProjectUpdate
from app.schemas.task import TaskResponse, TaskUpdate

router = APIRouter()
manager_only = Depends(require_role(["manager"]))

@router.get("/dashboard", dependencies=[manager_only])
async def get_manager_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve stats specifically for the manager
    projects_query = select(func.count(Project.id)).where(Project.manager_id == current_user.id)
    active_projects = await db.scalar(projects_query.where(Project.status == 'active'))
    completed_projects = await db.scalar(projects_query.where(Project.status == 'completed'))
    
    tasks_query = select(func.count(Task.id)).join(Project).where(Project.manager_id == current_user.id)
    pending_tasks = await db.scalar(tasks_query.where(Task.status.in_(['TODO', 'IN_PROGRESS'])))
    
    return {
        "activeProjects": active_projects or 0,
        "completedProjects": completed_projects or 0,
        "pendingTasks": pending_tasks or 0,
    }

@router.get("/projects", response_model=List[ProjectResponse], dependencies=[manager_only])
async def get_managed_projects(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    query = select(Project).where(Project.manager_id == current_user.id)
    if status:
        query = query.where(Project.status == status)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/projects/{project_id}", response_model=ProjectResponse, dependencies=[manager_only])
async def get_project_details(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id, 
            Project.manager_id == current_user.id
        )
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or access denied")
    return project

@router.patch("/projects/{project_id}", response_model=ProjectResponse, dependencies=[manager_only])
async def update_project(
    project_id: str,
    update_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == project_id, Project.manager_id == current_user.id))
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or access denied")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(project, key, value)
        
    await db.commit()
    await db.refresh(project)
    return project

@router.get("/tasks", response_model=List[TaskResponse], dependencies=[manager_only])
async def get_team_tasks(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).join(Project).where(Project.manager_id == current_user.id)
    if status:
        query = query.where(Task.status == status)
        
    result = await db.execute(query)
    return result.scalars().all()
