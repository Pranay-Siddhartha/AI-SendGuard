from sqlalchemy.orm import Session
from app import models
from app.documents import extract_text
from app.spacy.entity_extractor import extract_entities
from app.detectors import run_all_detectors
from app.llm.semantic_analysis import analyze_semantics
from app.risk.risk_engine import calculate_risk_score
from app.risk.decision_engine import evaluate_decision
from app.responses.response_builder import generate_explanation

def process_file(
    db: Session,
    file_bytes: bytes,
    filename: str,
    sender: str,
    recipient_email: str,
    recipient_type: str = "single"
):
    try:
        # 1. Text Extraction
        text = extract_text(filename, file_bytes)
        
        # 2. NER extraction (contextual)
        spacy_entities = extract_entities(text)
        
        # 3. Deterministic Detectors
        detectors = run_all_detectors(text)
        
        # 4. Semantic Analysis (Groq)
        semantic_context = analyze_semantics(text, sender, recipient_email, recipient_type)
        
        # Check recipient
        recipient = db.query(models.Recipient).filter(models.Recipient.email == recipient_email).first()
        is_external = False
        if recipient and recipient.type == "external":
            is_external = True
        
        # 5. Risk Scoring Engine
        risk_score = calculate_risk_score(detectors, semantic_context, is_external, recipient_type)
        
        # 6. Decision Engine
        decision_data = evaluate_decision(risk_score)
        
        # 7. Response Builder
        explanation = generate_explanation(
            decision=decision_data["decision"],
            score=risk_score,
            semantic_context=semantic_context,
            detectors=detectors,
            spacy_entities=spacy_entities,
            recipient_type=recipient_type
        )
        
        # Format detected entities for DB storage
        formatted_entities = [{"type": d.type, "value": d.value, "severity": d.severity} for d in detectors]
        
        # Format semantic sections for DB storage
        sensitive_sections = []
        if semantic_context.get("contains_sensitive_information"):
            sensitive_sections.append({
                "reason": semantic_context.get("reason", "Contains sensitive content"),
                "severity": decision_data["severity"].lower()
            })
        
        # Add group sharing risk warning
        if recipient_type == "group":
            group_risk = semantic_context.get("group_sharing_risk", "low").lower()
            if group_risk in ("high", "critical"):
                sensitive_sections.append({
                    "reason": f"This {semantic_context.get('document_type', 'document')} is a personal/confidential document not suitable for group distribution",
                    "severity": "high"
                })
            elif group_risk == "medium":
                sensitive_sections.append({
                    "reason": "Document contains some elements that may not be appropriate for group sharing",
                    "severity": "medium"
                })
        
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        document_category = semantic_context.get("document_type")
        
        if ext in {'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'}:
            document_category = "Image"
        elif ext in {'mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'}:
            document_category = "Video"
        elif ext in {'exe', 'msi', 'bin', 'apk', 'dmg', 'bat', 'sh'}:
            document_category = "Application"
        elif ext in {'mp3', 'wav', 'ogg', 'flac', 'm4a'}:
            document_category = "Audio"
            
        # Create database record
        db_analysis = models.Analysis(
            filename=filename,
            file_size=len(file_bytes),
            file_type=filename.split(".")[-1] if "." in filename else "unknown",
            sender=sender,
            recipient_email=recipient_email,
            status="completed",
            risk_score=risk_score,
            risk_level=decision_data["severity"].lower().replace(" ", "_"),
            decision=decision_data["decision"],
            summary=semantic_context.get("summary"),
            business_context=semantic_context.get("department"),
            detected_intent=document_category,
            ai_explanation=explanation,
            ai_confidence=0.95,
            pages=1,
            detected_entities=formatted_entities,
            sensitive_sections=sensitive_sections,
            recipient_name=recipient.name if recipient else None,
            recipient_org=recipient.organization if recipient else None,
            recipient_type=recipient_type,
            recipient_trust_level=recipient.trust_level if recipient else "neutral",
            recipient_risk_score=recipient.risk_score if recipient else 0.0
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        return db_analysis
        
    except Exception as e:
        print(f"Orchestration error: {e}")
        # Create a failed record
        db_analysis = models.Analysis(
            filename=filename,
            file_size=len(file_bytes),
            file_type=filename.split(".")[-1] if "." in filename else "unknown",
            sender=sender,
            recipient_email=recipient_email,
            status="failed",
            risk_score=0.0,
            risk_level="low",
            decision="safe_to_send",
            ai_explanation="Analysis failed due to an internal error.",
            pages=1
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        return db_analysis
