from typing import List, Optional
import io
import csv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.billing import Invoice
from app.models.project import Project

router = APIRouter()
manager_only = Depends(require_role(["admin", "manager"]))

@router.get("/invoices/csv", dependencies=[manager_only])
async def export_invoices_csv(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Invoice)
    if status:
        query = query.where(Invoice.status == status)
    result = await db.execute(query)
    invoices = result.scalars().all()
    
    # Generate CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Invoice Number", "Status", "Subtotal", "Tax", "Total", "Due Date", "Client ID"])
    
    for inv in invoices:
        writer.writerow([
            str(inv.id),
            inv.invoice_number,
            inv.status,
            inv.subtotal,
            inv.tax,
            inv.total,
            inv.due_date.isoformat() if inv.due_date else "",
            str(inv.client_id)
        ])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]), 
        media_type="text/csv", 
        headers={"Content-Disposition": "attachment; filename=invoices_report.csv"}
    )

@router.get("/projects/json", dependencies=[manager_only])
async def export_projects_json(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project))
    projects = result.scalars().all()
    
    report_data = []
    for p in projects:
        report_data.append({
            "id": str(p.id),
            "name": p.name,
            "status": p.status,
            "progress": p.progress,
            "manager_id": str(p.manager_id) if p.manager_id else None,
            "client_id": str(p.client_id) if p.client_id else None
        })
        
    return {"report_type": "Projects Export", "data": report_data, "count": len(report_data)}
