from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .core.database import Base



class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_size = Column(Integer)
    file_type = Column(String)
    pages = Column(Integer, default=1)
    sender = Column(String)
    recipient_email = Column(String)
    recipient_name = Column(String, nullable=True)
    recipient_org = Column(String, nullable=True)
    risk_score = Column(Float)
    risk_level = Column(String)
    decision = Column(String)
    summary = Column(Text, nullable=True)
    business_context = Column(Text, nullable=True)
    detected_intent = Column(Text, nullable=True)
    ai_explanation = Column(Text, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    detected_entities = Column(JSON, nullable=True)
    sensitive_sections = Column(JSON, nullable=True)
    recipient_risk_score = Column(Float, nullable=True)
    recipient_trust_level = Column(String, nullable=True)
    recipient_type = Column(String, nullable=True)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    category = Column(String)
    description = Column(String)
    enabled = Column(Boolean, default=True)
    severity = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    country = Column(String, nullable=True)
    type = Column(String, default="unknown")
    trust_level = Column(String, default="neutral")
    risk_score = Column(Float, default=50.0)
    communication_count = Column(Integer, default=0)
    last_communication = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
