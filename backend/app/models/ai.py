import uuid
from sqlalchemy import Column, String, Text, ForeignKey, JSON
from sqlalchemy import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class AIPromptTemplate(Base, TimestampMixin):
    __tablename__ = "ai_prompt_templates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String)
    system_prompt = Column(Text, nullable=False)
    user_prompt_template = Column(Text, nullable=False)
    parameters_schema = Column(JSON, default={})
    
class AIConversation(Base, TimestampMixin):
    __tablename__ = "ai_conversations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    messages = Column(JSON, default=[]) # stores chat history
    
    user = relationship("User")
