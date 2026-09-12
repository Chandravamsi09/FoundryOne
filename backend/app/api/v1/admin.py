from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, extract, and_, or_, case

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.organization import Organization
from app.models.project import Project
from app.models.billing import Invoice, Contract
from app.models.support import SupportTicket, AuditLog
from app.schemas.user import UserResponse
from app.schemas.organization import OrganizationResponse
from app.schemas.project import ProjectResponse

router = APIRouter()
admin_only = Depends(require_role(["admin"]))

@router.get("/stats", dependencies=[admin_only])
async def get_stats(db: AsyncSession = Depends(get_db)):
    total_users = await db.scalar(select(func.count(User.id)))
    total_employees = await db.scalar(select(func.count(User.id)).where(User.role == "employee"))
    total_managers = await db.scalar(select(func.count(User.id)).where(User.role == "manager"))
    total_clients = await db.scalar(select(func.count(User.id)).where(User.role == "client"))
    
    active_projects = await db.scalar(select(func.count(Project.id)).where(Project.status == "active"))
    completed_projects = await db.scalar(select(func.count(Project.id)).where(Project.status == "completed"))
    
    total_revenue = await db.scalar(select(func.sum(Invoice.total)).where(Invoice.status == "PAID"))
    pending_revenue = await db.scalar(select(func.sum(Invoice.total)).where(Invoice.status == "SENT"))

    open_tickets = await db.scalar(select(func.count(SupportTicket.id)).where(SupportTicket.status == "OPEN"))
    
    return {
        "totalUsers": total_users or 0,
        "totalEmployees": total_employees or 0,
        "totalManagers": total_managers or 0,
        "totalClients": total_clients or 0,
        "activeProjects": active_projects or 0,
        "completedProjects": completed_projects or 0,
        "totalRevenue": total_revenue or 0.0,
        "pendingRevenue": pending_revenue or 0.0,
        "openSupportTickets": open_tickets or 0,
        "systemHealth": {"cpu": 42, "memory": 68, "storage": 31}
    }

@router.get("/users", response_model=dict, dependencies=[admin_only])
async def get_users(
    page: int = 1, 
    limit: int = 10, 
    role: Optional[str] = None,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(User)
    
    if role:
        query = query.where(User.role == role)
    if status:
        query = query.where(User.status == status)
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                User.name.ilike(search_filter),
                User.email.ilike(search_filter)
            )
        )
        
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    
    return {
        "data": users,
        "total": total or 0,
        "page": page,
        "limit": limit,
        "totalPages": (total or 0) // limit + (1 if (total or 0) % limit > 0 else 0)
    }

@router.get("/organizations", response_model=List[OrganizationResponse], dependencies=[admin_only])
async def get_organizations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Organization))
    return result.scalars().all()

@router.get("/projects", response_model=List[ProjectResponse], dependencies=[admin_only])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project))
    return result.scalars().all()

@router.get("/analytics", dependencies=[admin_only])
async def get_analytics(db: AsyncSession = Depends(get_db)):
    # Complex queries for dashboard charting
    
    # 1. Role distribution
    roles_query = select(User.role, func.count(User.id)).group_by(User.role)
    roles_result = await db.execute(roles_query)
    role_distribution = [{"role": row[0], "count": row[1]} for row in roles_result.all()]
    
    # 2. Project Status Distribution
    projects_query = select(Project.status, func.count(Project.id)).group_by(Project.status)
    projects_result = await db.execute(projects_query)
    project_distribution = [{"status": row[0], "count": row[1]} for row in projects_result.all()]

    return {
        "roleDistribution": role_distribution,
        "projectDistribution": project_distribution,
        "completionRate": 78 # Placeholder for average progress
    }

@router.get("/audit-logs", dependencies=[admin_only])
async def get_audit_logs(
    page: int = 1,
    limit: int = 20,
    action: Optional[str] = None,
    actor_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(AuditLog).order_by(AuditLog.created_at.desc())
    if action:
        query = query.where(AuditLog.action == action)
    if actor_id:
        query = query.where(AuditLog.actor_id == actor_id)
        
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    
    return {
        "data": result.scalars().all(),
        "total": total or 0,
        "page": page,
        "limit": limit
    }
