from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.ai import AIPromptTemplate, AIConversation

router = APIRouter()

@router.get("/templates", dependencies=[Depends(require_role(["admin", "manager"]))])
async def get_templates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AIPromptTemplate))
    return result.scalars().all()

@router.post("/chat")
async def ai_chat(message: str, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    # Mock AI response logic for now
    return {"reply": f"AI acknowledges: {message}"}
