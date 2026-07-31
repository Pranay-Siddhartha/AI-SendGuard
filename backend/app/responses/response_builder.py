from app.detectors.models import Detection

def generate_explanation(decision: str, score: int, semantic_context: dict, detectors: list[Detection], spacy_entities: dict, recipient_type: str = "single") -> str:
    """
    Generates a professional, business-friendly explanation of the security decision
    without exposing internal implementation details like 'regex', 'spacy', or 'groq'.
    """
    # 1. Start with the core decision phrasing
    if decision == "safe_to_send":
        explanation = "This transfer is deemed safe. "
    elif decision == "warn":
        explanation = "This document contains elements that warrant caution. "
    elif decision == "approval_required":
        explanation = "Approval from an authorized reviewer is recommended before transmission. "
    elif decision == "block":
        explanation = "This transfer has been blocked due to critical security risks. "
    else:
        explanation = ""

    # 2. Add document context from semantic analysis
    doc_type = semantic_context.get("document_type", "document")
    explanation += f"This appears to be a {doc_type} "
    
    if semantic_context.get("department") and semantic_context.get("department") != "Unknown":
        explanation += f"related to {semantic_context.get('department')} operations. "
    else:
        explanation += ". "
        
    # 3. List discovered sensitive elements (Custom Detections + NER)
    friendly_names = {
        "EMAIL": "email addresses",
        "PHONE": "phone numbers",
        "URL": "URLs",
        "PAN": "PAN numbers",
        "AADHAAR": "Aadhaar numbers",
        "CREDIT_CARD": "credit card numbers",
        "BANK_ACCOUNT": "bank account numbers",
        "API_KEY": "API keys",
        "JWT_TOKEN": "JWT tokens",
        "PASSWORD": "passwords",
        "PRIVATE_KEY": "private keys",
        "CONNECTION": "database connections"
    }
    found_types = set([friendly_names.get(d.type, d.type.lower()) for d in detectors])
    
    if spacy_entities.get("persons"):
        found_types.add("personnel names")
    if spacy_entities.get("organizations"):
        found_types.add("organizational references")
        
    if found_types:
        explanation += "It contains " + ", ".join(sorted(list(found_types))) + ". "
        
    # 4. Add semantic reasoning
    if semantic_context.get("contains_sensitive_information"):
        explanation += "Because it contains highly sensitive information, sharing it externally could expose confidential organizational data. "
    
    # 5. Add group sharing warning
    if recipient_type == "group":
        group_risk = semantic_context.get("group_sharing_risk", "low").lower()
        if group_risk in ("high", "critical"):
            explanation += f"⚠️ GROUP SHARING ALERT: This document is classified as a personal/confidential document that is NOT suitable for group distribution. Sharing it with multiple recipients significantly increases the risk of data exposure."
        elif group_risk == "medium":
            explanation += "Note: This document is being shared with a group. Exercise caution as broader distribution increases exposure risk."
        else:
            explanation += "This document appears suitable for group sharing."
        
    return explanation
