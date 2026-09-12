import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Contract(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "contracts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="DRAFT") # DRAFT, ACTIVE, EXPIRED, TERMINATED
    value = Column(Float, nullable=False, default=0.0)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    client = relationship("User", foreign_keys=[client_id])
    project = relationship("Project", foreign_keys=[project_id])

class Invoice(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "invoices"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number = Column(String(100), unique=True)
    status = Column(String(50), default="DRAFT") # DRAFT, SENT, PAID, OVERDUE
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    due_date = Column(DateTime(timezone=True))
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=True)
    client = relationship("User", foreign_keys=[client_id])
    contract = relationship("Contract", foreign_keys=[contract_id])

class Payment(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="PENDING")
    provider = Column(String(100))
    transaction_id = Column(String(255))
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"))
    invoice = relationship("Invoice", foreign_keys=[invoice_id])
