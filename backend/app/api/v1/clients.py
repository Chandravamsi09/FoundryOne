from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.project import Project
from app.models.billing import Invoice, Contract, Payment
from app.models.support import SupportTicket
from app.schemas.project import ProjectResponse
from app.schemas.billing import InvoiceResponse, ContractResponse

router = APIRouter()
client_only = Depends(require_role(["client"]))

@router.get("/dashboard", dependencies=[client_only])
async def get_client_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch overview specific to client
    projects = await db.scalar(select(Project).where(Project.client_id == current_user.id))
    invoices = await db.scalar(select(Invoice).where(Invoice.client_id == current_user.id, Invoice.status == "SENT"))
    tickets = await db.scalar(select(SupportTicket).where(SupportTicket.client_id == current_user.id, SupportTicket.status == "OPEN"))
    
    return {
        "activeProjects": projects or 0,
        "pendingInvoices": invoices or 0,
        "openTickets": tickets or 0,
    }

@router.get("/projects", response_model=List[ProjectResponse], dependencies=[client_only])
async def get_client_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.client_id == current_user.id))
    return result.scalars().all()

@router.get("/projects/{project_id}", response_model=ProjectResponse, dependencies=[client_only])
async def get_client_project_details(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == project_id, Project.client_id == current_user.id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/invoices", response_model=List[InvoiceResponse], dependencies=[client_only])
async def get_client_invoices(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Invoice).where(Invoice.client_id == current_user.id)
    if status:
        query = query.where(Invoice.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/contracts", response_model=List[ContractResponse], dependencies=[client_only])
async def get_client_contracts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Contract).where(Contract.client_id == current_user.id))
    return result.scalars().all()

@router.get("/support-tickets", dependencies=[client_only])
async def get_client_tickets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(SupportTicket).where(SupportTicket.client_id == current_user.id))
    return result.scalars().all()

@router.post("/support-tickets", dependencies=[client_only])
async def create_client_ticket(
    subject: str,
    description: str,
    priority: str = "MEDIUM",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_ticket = SupportTicket(
        subject=subject,
        description=description,
        priority=priority,
        client_id=current_user.id,
        status="OPEN"
    )
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    return new_ticket
