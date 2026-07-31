import re
from .models import Detection

def detect_api_keys(text: str) -> list[Detection]:
    results = []
    patterns = {
        "AWS_ACCESS_KEY": re.compile(r'(?i)\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b'),
        "GENERIC_API_KEY": re.compile(r'(?i)\b(?:api[_-]?key|secret|token)["\'\s]*[:=]["\'\s]*([a-zA-Z0-9_\-]{16,64})\b')
    }
    
    for key_type, pattern in patterns.items():
        for match in pattern.finditer(text):
            val = match.group(1) if len(match.groups()) > 0 else match.group()
            results.append(
                Detection(
                    type=key_type,
                    value=val,
                    severity="critical",
                    start=match.start(),
                    end=match.end()
                )
            )
    return results
