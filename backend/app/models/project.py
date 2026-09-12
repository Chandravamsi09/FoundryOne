import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Project(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    status = Column(String(50), nullable=False, default="planning") # planning, active, on_hold, completed
    progress = Column(Float, default=0.0)
    deadline = Column(DateTime(timezone=True), nullable=True)

    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="projects")
    manager = relationship("User", back_populates="managed_projects", foreign_keys=[manager_id])
    client = relationship("User", back_populates="owned_projects", foreign_keys=[client_id])
    tasks = relationship("Task", back_populates="project")
