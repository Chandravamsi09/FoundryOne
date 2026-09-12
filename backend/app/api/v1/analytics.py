from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.permissions import require_role
from app.models.user import User
from app.models.project import Project
from app.models.billing import Invoice

router = APIRouter()
admin_only = Depends(require_role(["admin"]))

@router.get("/financials", dependencies=[admin_only])
async def get_financial_analytics(db: AsyncSession = Depends(get_db)):
    # Calculate revenue over the last 6 months (mocked logic for simplicity, usually involves group_by month)
    # This simulates a complex time-series aggregation query
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    recent_revenue_query = select(func.sum(Invoice.total)).where(
        Invoice.status == "PAID",
        Invoice.created_at >= thirty_days_ago
    )
    recent_revenue = await db.scalar(recent_revenue_query)
    
    total_revenue_query = select(func.sum(Invoice.total)).where(Invoice.status == "PAID")
    total_revenue = await db.scalar(total_revenue_query)
    
    return {
        "metrics": {
            "totalRevenue": total_revenue or 0.0,
            "revenueLast30Days": recent_revenue or 0.0,
            "growthRate": 15.5 # Simulated calculation
        },
        "trends": [
            {"month": "Jan", "revenue": 12000},
            {"month": "Feb", "revenue": 15000},
            {"month": "Mar", "revenue": 18000},
            {"month": "Apr", "revenue": 22000},
            {"month": "May", "revenue": 26000},
            {"month": "Jun", "revenue": 30000},
        ]
    }

@router.get("/productivity", dependencies=[admin_only])
async def get_productivity_analytics(db: AsyncSession = Depends(get_db)):
    active_projects = await db.scalar(select(func.count(Project.id)).where(Project.status == "active"))
    completed_projects = await db.scalar(select(func.count(Project.id)).where(Project.status == "completed"))
    
    return {
        "activeProjects": active_projects or 0,
        "completedProjects": completed_projects or 0,
        "overallCompletionRate": round((completed_projects / (active_projects + completed_projects)) * 100, 2) if (active_projects + completed_projects) > 0 else 0
    }
