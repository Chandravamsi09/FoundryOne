import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Task(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    status = Column(String(50), nullable=False, default="TODO") # TODO, IN_PROGRESS, IN_REVIEW, BLOCKED, COMPLETED
    priority = Column(String(50), nullable=False, default="MEDIUM") # LOW, MEDIUM, HIGH, URGENT
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User")
