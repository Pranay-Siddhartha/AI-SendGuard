from .weights import ENTITY_WEIGHTS, SEMANTIC_WEIGHTS
from app.detectors.models import Detection

# Risk boost based on group_sharing_risk level from semantic analysis
GROUP_RISK_BOOST = {
    "low": 5,
    "medium": 15,
    "high": 30,
    "critical": 45
}

def calculate_risk_score(detectors: list[Detection], semantic_context: dict, is_external: bool, recipient_type: str = "single") -> int:
    score = 0
    
    # 1. Add weights from detected entities
    for detection in detectors:
        score += ENTITY_WEIGHTS.get(detection.type, 0)
        
    # 2. Add weights from semantic analysis
    doc_type = semantic_context.get("document_type", "")
    for known_type, weight in SEMANTIC_WEIGHTS["document_type"].items():
        if known_type.lower() in doc_type.lower():
            score += weight
            break # Only apply one document type weight
            
    if semantic_context.get("contains_sensitive_information"):
        score += SEMANTIC_WEIGHTS["flags"]["contains_sensitive_information"]
        
    if is_external:
        score += SEMANTIC_WEIGHTS["flags"]["is_external"]
    
    # 3. Group recipient risk adjustment
    # Sending personal/sensitive docs to a group is significantly riskier
    if recipient_type == "group":
        group_risk = semantic_context.get("group_sharing_risk", "low").lower()
        score += GROUP_RISK_BOOST.get(group_risk, 5)
        
    # Cap total score at 100
    return min(100, score)
