from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    organization: Optional[str] = None
    role: str = "analyst"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PolicyBase(BaseModel):
    name: str
    category: str
    description: str
    enabled: bool = True
    severity: str

class PolicyUpdate(BaseModel):
    enabled: Optional[bool] = None
    severity: Optional[str] = None

class PolicyResponse(PolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RecipientBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    organization: Optional[str] = None
    country: Optional[str] = None
    type: str = "unknown"
    trust_level: str = "neutral"

class RecipientCreate(RecipientBase):
    pass

class RecipientResponse(RecipientBase):
    id: int
    risk_score: float
    communication_count: int
    last_communication: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    file_type: str
    sender: str
    recipient_email: str
    risk_score: float
    risk_level: str
    decision: str
    summary: Optional[str] = None
    ai_explanation: Optional[str] = None
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

class AnalysisDetailResponse(AnalysisResponse):
    pages: int
    recipient_name: Optional[str] = None
    recipient_org: Optional[str] = None
    business_context: Optional[str] = None
    detected_intent: Optional[str] = None
    ai_confidence: Optional[float] = None
    detected_entities: Optional[List[Dict[str, Any]]] = None
    sensitive_sections: Optional[List[Dict[str, Any]]] = None
    recipient_risk_score: Optional[float] = None
    recipient_trust_level: Optional[str] = None
    recipient_type: Optional[str] = None

    class Config:
        from_attributes = True
