from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class ContractBase(BaseModel):
    title: str
    status: Optional[str] = "DRAFT"
    value: float
    client_id: UUID
    project_id: UUID

class InvoiceBase(BaseModel):
    invoice_number: str
    status: Optional[str] = "DRAFT"
    subtotal: float
    tax: float
    total: float
    due_date: datetime
    client_id: UUID
    contract_id: Optional[UUID] = None

class ContractResponse(ContractBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

class InvoiceResponse(InvoiceBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True
