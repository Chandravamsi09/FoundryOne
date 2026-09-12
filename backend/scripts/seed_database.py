import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.core.config import settings
from app.core.security import get_password_hash
from app.core.database import Base
from app.models.organization import Organization
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.billing import Contract, Invoice, Payment
from app.models.support import SupportTicket, AuditLog

async def seed_db():
    print("Connecting to database...")
    engine_kwargs = {"echo": False}
    engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)
    
    # Create all tables first if sqlite/local
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        print("Creating Organizations...")
        org1 = Organization(name="FoundryOne", industry="Technology", size="51-200")
        org2 = Organization(name="Acme Corp", industry="Manufacturing", size="201-500")
        org3 = Organization(name="Globex", industry="Finance", size="1001-5000")
        
        session.add_all([org1, org2, org3])
        await session.commit()
        await session.refresh(org1)
        await session.refresh(org2)
        await session.refresh(org3)

        print("Creating Users...")
        admin = User(email="admin@foundryone.com", name="Admin User", role="admin", hashed_password=get_password_hash("Admin@123"), organization_id=org1.id)
        manager1 = User(email="manager@foundryone.com", name="Manager User", role="manager", hashed_password=get_password_hash("Manager@123"), organization_id=org2.id)
        employee1 = User(email="employee@foundryone.com", name="Employee User", role="employee", hashed_password=get_password_hash("Employee@123"), organization_id=org2.id)
        client1 = User(email="client@foundryone.com", name="Client User", role="client", hashed_password=get_password_hash("Client@123"), organization_id=org3.id)
        
        session.add_all([admin, manager1, employee1, client1])
        await session.commit()
        await session.refresh(manager1)
        await session.refresh(client1)

        print("Creating Projects and Tasks...")
        p1 = Project(name="FoundryOne Enterprise Portal", description="Core web portal redesign with unified dashboard", status="active", progress=72.0, organization_id=org2.id, manager_id=manager1.id, client_id=client1.id)
        p2 = Project(name="Cloud Infrastructure Modernization", description="Migrating services to scalable microservices", status="active", progress=58.0, organization_id=org2.id, manager_id=manager1.id, client_id=client1.id)
        
        session.add_all([p1, p2])
        await session.commit()
        await session.refresh(p1)
        
        tasks = [
            Task(title="Finalize Manager Dashboard Metrics", description="Ensure accurate computation of metrics", status="IN_PROGRESS", priority="HIGH", project_id=p1.id),
            Task(title="Implement Connection Pooling", description="Tune engine connection limits", status="TODO", priority="CRITICAL", project_id=p1.id),
            Task(title="QA Testing on Project Detail Form", description="Verify field validation and constraints", status="IN_PROGRESS", priority="MEDIUM", project_id=p1.id),
        ]
            
        session.add_all(tasks)
        await session.commit()

        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
