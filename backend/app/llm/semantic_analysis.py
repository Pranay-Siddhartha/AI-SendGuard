from pydantic import BaseModel
from .groq_client import generate_json_completion

class SemanticContext(BaseModel):
    document_type: str
    department: str
    summary: str
    contains_sensitive_information: bool
    recommended_action: str
    reason: str
    group_sharing_risk: str

SYSTEM_PROMPT = """
You are an expert enterprise cybersecurity analyst. 
Your ONLY job is to perform semantic analysis and determine the business context, purpose, and sensitivity of the document.
DO NOT extract specific entities (like names, emails, phones, API keys).

IMPORTANT: Consider the recipient type carefully.
- "single" means the file is being sent to one person directly.
- "group" means the file is being shared with multiple people (e.g. a group chat, mailing list, team channel).

Documents like resumes, bank statements, medical records, salary slips, personal IDs, tax returns, and individual performance reviews are PERSONAL documents — they are typically meant for a single recipient and should be flagged as HIGH RISK when shared with a group.

Documents like meeting notes, project updates, company announcements, presentations, and general reports are typically safe for group sharing.

Analyze the meaning of the document and return a JSON object with the following schema:
{
    "document_type": "string (e.g. Resume, Bank Statement, Invoice, Internal Memo, Source Code, Salary Slip, Medical Record, Tax Return, Meeting Notes, Project Report)",
    "department": "string (e.g. HR, Finance, Engineering, Legal)",
    "summary": "string (Executive summary of the document's purpose)",
    "contains_sensitive_information": boolean,
    "recommended_action": "string (Safe to Send, Warn User, Approval Required, Block Transfer)",
    "reason": "string (Business explanation of why it is sensitive or safe)",
    "group_sharing_risk": "string (low, medium, high, critical) - How risky is it to share this document with a group instead of a single recipient"
}
"""

# Document types that are inherently personal and risky to share in groups
PERSONAL_DOC_TYPES = {
    "resume", "bank statement", "salary slip", "payslip", "pay stub",
    "medical record", "health report", "tax return", "tax document",
    "performance review", "appraisal", "personal id", "passport",
    "aadhaar", "pan card", "driver license", "social security",
    "credit report", "loan application", "insurance claim"
}

def analyze_semantics(text: str, sender: str, recipient: str, recipient_type: str = "single") -> dict:
    recipient_context = f"Recipient Type: {recipient_type}"
    if recipient_type == "group":
        recipient_context += " (This file will be shared with MULTIPLE people in a group)"
    
    user_prompt = f"Sender: {sender}\nRecipient: {recipient}\n{recipient_context}\n\nDocument Text:\n{text[:10000]}"
    
    result = generate_json_completion(SYSTEM_PROMPT, user_prompt)
    if result:
        # If LLM didn't set group_sharing_risk, infer it from document type
        if "group_sharing_risk" not in result:
            doc_type = result.get("document_type", "").lower()
            is_personal = any(p in doc_type for p in PERSONAL_DOC_TYPES)
            result["group_sharing_risk"] = "high" if is_personal else "low"
        return result
        
    # Fallback heuristic if LLM fails
    sensitive_keywords = ["confidential", "salary", "password", "secret", "private"]
    is_sensitive = any(kw in text.lower() for kw in sensitive_keywords)
    
    # Heuristic group risk check
    personal_keywords = ["resume", "cv", "bank statement", "salary", "medical", "tax return", "payslip"]
    is_personal_doc = any(kw in text.lower() for kw in personal_keywords)
    
    return {
        "document_type": "Unknown Document",
        "department": "Unknown",
        "summary": "Semantic analysis failed or unavailable. Falling back to heuristic scan.",
        "contains_sensitive_information": is_sensitive,
        "recommended_action": "Warn User" if is_sensitive else "Safe to Send",
        "reason": "Fallback heuristic applied due to LLM unavailability.",
        "group_sharing_risk": "high" if is_personal_doc else "low"
    }
