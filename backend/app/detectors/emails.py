import re
from .models import Detection

def detect_emails(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="EMAIL",
                value=match.group(),
                severity="medium",
                start=match.start(),
                end=match.end()
            )
        )
    return results
