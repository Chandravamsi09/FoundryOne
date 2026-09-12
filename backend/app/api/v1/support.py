from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.support import SupportTicket

router = APIRouter()
staff_only = Depends(require_role(["admin", "manager", "employee"]))

@router.get("/", dependencies=[staff_only])
async def get_all_tickets(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(SupportTicket)
    if status:
        query = query.where(SupportTicket.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/{ticket_id}/status", dependencies=[staff_only])
async def update_ticket_status(
    ticket_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(SupportTicket).where(SupportTicket.id == ticket_id))
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = status
    # Assuming if an employee touches it, they are assigned to it
    if not ticket.assigned_to_id:
        ticket.assigned_to_id = current_user.id
        
    await db.commit()
    return {"message": "Ticket updated", "status": ticket.status}
