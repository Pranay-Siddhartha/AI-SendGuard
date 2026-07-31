from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models import Analysis
import math

router = APIRouter()

@router.get("/")
def get_history(
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None,
    risk_level: Optional[str] = None,
    decision: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Analysis)
    
    # Apply filters
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Analysis.filename.ilike(search_filter)) | 
            (Analysis.recipient_email.ilike(search_filter)) |
            (Analysis.sender.ilike(search_filter))
        )
    
    if risk_level:
        query = query.filter(Analysis.risk_level == risk_level)
        
    if decision:
        query = query.filter(Analysis.decision == decision)
        
    # Get total count before pagination
    total = query.count()
    
    # Calculate pages
    total_pages = math.ceil(total / per_page) if total > 0 else 1
    
    # Apply pagination and sorting (newest first)
    items = query.order_by(Analysis.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }
