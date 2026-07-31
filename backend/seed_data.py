import asyncio
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app import models
from app.core.config import settings

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Removed user creation

    # Create policies
    policies = [
        {"name": "PII Detection", "category": "Privacy", "description": "Detects Personally Identifiable Information.", "severity": "high"},
        {"name": "Financial Data", "category": "Finance", "description": "Detects financial data such as credit cards and IBANs.", "severity": "critical"},
        {"name": "Medical Records", "category": "Healthcare", "description": "Detects medical and health-related information.", "severity": "critical"},
        {"name": "Passwords", "category": "Security", "description": "Detects plaintext passwords.", "severity": "critical"},
        {"name": "API Keys", "category": "Security", "description": "Detects API keys and secrets.", "severity": "critical"},
        {"name": "Source Code", "category": "Intellectual Property", "description": "Detects proprietary source code.", "severity": "high"},
        {"name": "Confidential Docs", "category": "Business", "description": "Detects internal confidential documents.", "severity": "medium"},
    ]
    
    for p in policies:
        if not db.query(models.Policy).filter(models.Policy.name == p["name"]).first():
            db.add(models.Policy(**p))

    # Create recipients
    recipients = [
        {"email": "internal@sendguard.ai", "name": "Internal Colleague", "organization": "SendGuard", "type": "internal", "trust_level": "trusted", "risk_score": 5.0},
        {"email": "partner@partner.com", "name": "Partner User", "organization": "Partner Inc", "type": "external", "trust_level": "neutral", "risk_score": 40.0},
        {"email": "unknown@hacker.com", "name": "Unknown", "organization": "Unknown", "type": "unknown", "trust_level": "untrusted", "risk_score": 90.0},
    ]

    for r in recipients:
        if not db.query(models.Recipient).filter(models.Recipient.email == r["email"]).first():
            db.add(models.Recipient(**r))

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
