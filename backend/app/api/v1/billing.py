from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime

from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.user import User
from app.models.billing import Invoice, Contract, Payment
from app.schemas.billing import InvoiceResponse, ContractResponse, InvoiceBase, ContractBase

router = APIRouter()
staff_only = Depends(require_role(["admin", "manager"]))

@router.post("/contracts", response_model=ContractResponse, dependencies=[staff_only])
async def create_contract(
    data: ContractBase,
    db: AsyncSession = Depends(get_db)
):
    new_contract = Contract(**data.model_dump())
    db.add(new_contract)
    await db.commit()
    await db.refresh(new_contract)
    return new_contract

@router.get("/contracts", response_model=List[ContractResponse], dependencies=[staff_only])
async def get_all_contracts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contract))
    return result.scalars().all()

@router.patch("/contracts/{contract_id}/status", dependencies=[staff_only])
async def update_contract_status(
    contract_id: str,
    status: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalars().first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    contract.status = status
    await db.commit()
    return {"message": "Contract updated"}

@router.post("/invoices", response_model=InvoiceResponse, dependencies=[staff_only])
async def create_invoice(
    data: InvoiceBase,
    db: AsyncSession = Depends(get_db)
):
    new_invoice = Invoice(**data.model_dump())
    db.add(new_invoice)
    await db.commit()
    await db.refresh(new_invoice)
    return new_invoice

@router.get("/invoices", response_model=List[InvoiceResponse], dependencies=[staff_only])
async def get_all_invoices(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Invoice)
    if status:
        query = query.where(Invoice.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/invoices/{invoice_id}/payments", dependencies=[staff_only])
async def record_payment(
    invoice_id: str,
    amount: float,
    provider: str = "Stripe",
    transaction_id: str = "txn_xxx",
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalars().first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    payment = Payment(
        invoice_id=invoice.id,
        amount=amount,
        provider=provider,
        transaction_id=transaction_id,
        status="COMPLETED"
    )
    db.add(payment)
    
    # Simple logic to mark invoice as paid
    if invoice.total <= amount:
        invoice.status = "PAID"
    else:
        invoice.status = "PARTIALLY_PAID"
        
    await db.commit()
    return {"message": "Payment recorded"}
