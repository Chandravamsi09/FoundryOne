import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime
from sqlalchemy import UUID
from sqlalchemy.orm import declarative_mixin

def utc_now():
    return datetime.now(timezone.utc)

@declarative_mixin
class TimestampMixin:
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

@declarative_mixin
class SoftDeleteMixin:
    deleted_at = Column(DateTime(timezone=True), nullable=True)
