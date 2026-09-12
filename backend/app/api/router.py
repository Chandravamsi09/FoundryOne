from fastapi import APIRouter
from app.api.v1 import auth, admin, clients, managers, employees, billing, ai, support, reports, analytics
from app.integrations.github import routes as github_routes

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(managers.router, prefix="/managers", tags=["managers"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(support.router, prefix="/support", tags=["support"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(github_routes.router, prefix="/github", tags=["github"])
