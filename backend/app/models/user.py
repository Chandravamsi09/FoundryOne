import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False, default="employee") # admin, manager, employee, client
    status = Column(String(50), nullable=False, default="active") # active, inactive
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    managed_projects = relationship("Project", back_populates="manager", foreign_keys="[Project.manager_id]")
    owned_projects = relationship("Project", back_populates="client", foreign_keys="[Project.client_id]")
