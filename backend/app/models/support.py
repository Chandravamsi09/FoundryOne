import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class SupportTicket(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "support_tickets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String(255), nullable=False)
    description = Column(String)
    status = Column(String(50), default="OPEN") # OPEN, IN_PROGRESS, RESOLVED, CLOSED
    priority = Column(String(50), default="MEDIUM")
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    client = relationship("User", foreign_keys=[client_id])
    assignee = relationship("User", foreign_keys=[assigned_to_id])

class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity = Column(String(100))
    entity_id = Column(UUID(as_uuid=True))
    details = Column(String)
