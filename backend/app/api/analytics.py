from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models import Analysis
import json

router = APIRouter()

@router.get("/")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(Analysis).count()
    if total == 0:
        return {
            "total_analyses": 0,
            "high_risk_count": 0,
            "blocked_count": 0,
            "safe_count": 0,
            "warn_count": 0,
            "avg_risk_score": 0,
            "risk_distribution": {"safe": 0, "low": 0, "medium": 0, "high": 0, "critical": 0},
            "entity_type_counts": []
        }
        
    safe_count = db.query(Analysis).filter(Analysis.decision == "safe_to_send").count()
    warn_count = db.query(Analysis).filter(Analysis.decision == "warn").count()
    blocked_count = db.query(Analysis).filter(Analysis.decision == "block").count()
    
    avg_score_res = db.query(func.avg(Analysis.risk_score)).scalar()
    avg_score = round(avg_score_res) if avg_score_res else 0
    
    # Risk distribution
    safe_lvl = db.query(Analysis).filter(Analysis.risk_level == "safe").count()
    low_lvl = db.query(Analysis).filter(Analysis.risk_level == "low").count()
    medium_lvl = db.query(Analysis).filter(Analysis.risk_level == "medium").count()
    high_lvl = db.query(Analysis).filter(Analysis.risk_level == "high").count()
    critical_lvl = db.query(Analysis).filter(Analysis.risk_level == "critical").count()
    
    # Calculate entity counts by parsing the JSON field
    analyses = db.query(Analysis).all()
    entity_counts = {}
    for a in analyses:
        if a.detected_entities:
            entities = a.detected_entities
            if isinstance(entities, str):
                try:
                    entities = json.loads(entities)
                except:
                    entities = []
            for e in entities:
                t = e.get("type", "unknown")
                entity_counts[t] = entity_counts.get(t, 0) + 1
                
    entity_type_counts = [{"type": k, "count": v} for k, v in sorted(entity_counts.items(), key=lambda x: x[1], reverse=True)]
    
    return {
        "total_analyses": total,
        "high_risk_count": high_lvl + critical_lvl,
        "blocked_count": blocked_count,
        "safe_count": safe_count,
        "warn_count": warn_count,
        "avg_risk_score": avg_score,
        "risk_distribution": {
            "safe": safe_lvl,
            "low": low_lvl,
            "medium": medium_lvl,
            "high": high_lvl,
            "critical": critical_lvl
        },
        "entity_type_counts": entity_type_counts
    }
