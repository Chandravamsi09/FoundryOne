from typing import List, Optional
from uuid import UUID
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
from app.schemas.project import ProjectResponse, ProjectUpdate, ProjectCreate
from app.schemas.task import TaskResponse, TaskUpdate, TaskCreate

router = APIRouter()
manager_only = Depends(require_role(["manager"]))

@router.get("/dashboard", dependencies=[manager_only])
async def get_manager_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve stats specifically for the manager
    projects_query = select(func.count(Project.id)).where(Project.manager_id == current_user.id)
    active_projects = await db.scalar(projects_query.where(Project.status.in_(['active', 'in_progress', 'planning', 'on_track'])))
    completed_projects = await db.scalar(projects_query.where(Project.status == 'completed'))
    
    tasks_query = select(func.count(Task.id)).join(Project).where(Project.manager_id == current_user.id)
    pending_tasks = await db.scalar(tasks_query.where(Task.status.in_(['TODO', 'IN_PROGRESS', 'todo', 'in_progress'])))
    
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

@router.post("/projects", response_model=ProjectResponse, dependencies=[manager_only])
async def create_managed_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_project = Project(
        name=project_in.name,
        description=project_in.description,
        status=project_in.status or "planning",
        progress=project_in.progress or 0.0,
        deadline=project_in.deadline,
        organization_id=project_in.organization_id or current_user.organization_id,
        manager_id=current_user.id,
        client_id=project_in.client_id
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@router.get("/projects/{project_id}", response_model=ProjectResponse, dependencies=[manager_only])
async def get_project_details(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        pid = UUID(project_id)
        query = select(Project).where(Project.id == pid, Project.manager_id == current_user.id)
    except ValueError:
        query = select(Project).where(Project.name == project_id, Project.manager_id == current_user.id)
        
    result = await db.execute(query)
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
    try:
        pid = UUID(project_id)
        query = select(Project).where(Project.id == pid, Project.manager_id == current_user.id)
    except ValueError:
        query = select(Project).where(Project.name == project_id, Project.manager_id == current_user.id)
        
    result = await db.execute(query)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or access denied")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(project, key, value)
        
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/projects/{project_id}", dependencies=[manager_only])
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        pid = UUID(project_id)
        query = select(Project).where(Project.id == pid, Project.manager_id == current_user.id)
    except ValueError:
        query = select(Project).where(Project.name == project_id, Project.manager_id == current_user.id)
        
    result = await db.execute(query)
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted successfully"}

@router.get("/tasks", response_model=List[TaskResponse], dependencies=[manager_only])
async def get_team_tasks(
    status: Optional[str] = None,
    project_id: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).join(Project).where(Project.manager_id == current_user.id)
    if status:
        query = query.where(Task.status == status)
    if project_id:
        try:
            pid = UUID(project_id)
            query = query.where(Task.project_id == pid)
        except ValueError:
            pass
        
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/tasks", response_model=TaskResponse, dependencies=[manager_only])
async def create_team_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status or "TODO",
        priority=task_in.priority or "MEDIUM",
        due_date=task_in.due_date,
        project_id=task_in.project_id,
        assignee_id=task_in.assignee_id
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

@router.patch("/tasks/{task_id}", response_model=TaskResponse, dependencies=[manager_only])
async def update_team_task(
    task_id: str,
    update_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        tid = UUID(task_id)
        query = select(Task).where(Task.id == tid)
    except ValueError:
        query = select(Task).where(Task.title == task_id)
        
    result = await db.execute(query)
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(task, key, value)
        
    await db.commit()
    await db.refresh(task)
    return task

@router.delete("/tasks/{task_id}", dependencies=[manager_only])
async def delete_team_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        tid = UUID(task_id)
        query = select(Task).where(Task.id == tid)
    except ValueError:
        query = select(Task).where(Task.title == task_id)
        
    result = await db.execute(query)
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    await db.delete(task)
    await db.commit()
    return {"message": "Task deleted successfully"}

@router.get("/team", dependencies=[manager_only])
async def get_manager_team(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(User).where(User.role == "employee")
    if current_user.organization_id:
        query = query.where(User.organization_id == current_user.organization_id)
    result = await db.execute(query)
    employees = result.scalars().all()
    
    return [
        {
            "id": str(emp.id),
            "name": emp.name,
            "email": emp.email,
            "role": "Employee",
            "department": "Engineering",
            "status": emp.status or "active",
            "tasksCompleted": 12,
            "workload": 65,
            "phone": emp.phone or "",
        }
        for emp in employees
    ]
