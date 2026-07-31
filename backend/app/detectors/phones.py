import re
from .models import Detection

def detect_phones(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="PHONE",
                value=match.group(),
                severity="low",
                start=match.start(),
                end=match.end()
            )
        )
    return results
