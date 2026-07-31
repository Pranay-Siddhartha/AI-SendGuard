def evaluate_decision(score: int) -> dict:
    """
    Evaluates the final decision based on the calculated risk score.
    Returns the severity bracket and the actionable decision.
    """
    if score <= 20:
        severity = "Safe"
        decision = "safe_to_send"
    elif score <= 40:
        severity = "Low Risk"
        decision = "warn"
    elif score <= 60:
        severity = "Medium Risk"
        decision = "warn"
    elif score <= 80:
        severity = "High Risk"
        decision = "approval_required"
    else:
        severity = "Critical"
        decision = "block"
        
    return {
        "severity": severity,
        "decision": decision
    }
