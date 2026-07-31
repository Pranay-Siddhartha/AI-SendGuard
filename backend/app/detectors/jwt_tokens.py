import re
from .models import Detection

def detect_jwt_tokens(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'\beyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="JWT_TOKEN",
                value=match.group(),
                severity="high",
                start=match.start(),
                end=match.end()
            )
        )
    return results
