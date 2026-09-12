import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from passlib.context import CryptContext

from app.core.config import settings
from app.models.organization import Organization
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.billing import Contract, Invoice, Payment
from app.models.support import SupportTicket, AuditLog

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_db():
    print("Connecting to database...")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
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
        admin = User(email="admin@foundryone.com", name="Admin User", role="admin", hashed_password=pwd_context.hash("password123"), organization_id=org1.id)
        manager1 = User(email="manager@acme.com", name="Bob Smith", role="manager", hashed_password=pwd_context.hash("password123"), organization_id=org2.id)
        employee1 = User(email="employee@acme.com", name="Alice Johnson", role="employee", hashed_password=pwd_context.hash("password123"), organization_id=org2.id)
        client1 = User(email="client@globex.com", name="Charlie Davis", role="client", hashed_password=pwd_context.hash("password123"), organization_id=org3.id)
        
        # Add 50 more employees to increase data volume
        bulk_users = []
        for i in range(50):
            bulk_users.append(
                User(email=f"employee{i}@acme.com", name=f"Bulk Employee {i}", role="employee", hashed_password=pwd_context.hash("password123"), organization_id=org2.id)
            )

        session.add_all([admin, manager1, employee1, client1] + bulk_users)
        await session.commit()
        await session.refresh(manager1)
        await session.refresh(client1)

        print("Creating Projects and Tasks...")
        p1 = Project(name="Website Redesign", description="Revamp company website", status="active", progress=65.0, organization_id=org2.id, manager_id=manager1.id, client_id=client1.id)
        p2 = Project(name="Mobile App", description="iOS and Android app", status="active", progress=40.0, organization_id=org2.id, manager_id=manager1.id, client_id=client1.id)
        
        session.add_all([p1, p2])
        await session.commit()
        await session.refresh(p1)
        
        # Add 100 tasks
        tasks = []
        for i in range(100):
            tasks.append(Task(title=f"Development Task {i}", description="Detailed task requirements...", status="TODO", project_id=p1.id))
            
        session.add_all(tasks)
        await session.commit()

        print("Creating Contracts and Invoices...")
        c1 = Contract(title="Annual Service Agreement", status="ACTIVE", value=50000.0, client_id=client1.id, project_id=p1.id)
        session.add(c1)
        await session.commit()
        await session.refresh(c1)
        
        inv1 = Invoice(invoice_number="INV-2026-001", status="PAID", subtotal=5000.0, tax=500.0, total=5500.0, due_date=datetime.now() + timedelta(days=30), client_id=client1.id, contract_id=c1.id)
        session.add(inv1)
        await session.commit()
        
        print("Creating Audit Logs...")
        logs = []
        for i in range(500):
            logs.append(AuditLog(actor_id=admin.id, action=f"ACTION_{i}", entity="System", details="Routine operation"))
        session.add_all(logs)
        await session.commit()
        
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
