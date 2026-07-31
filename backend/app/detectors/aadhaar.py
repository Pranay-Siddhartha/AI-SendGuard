import re
from .models import Detection

def detect_aadhaar(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="AADHAAR",
                value=match.group(),
                severity="high",
                start=match.start(),
                end=match.end()
            )
        )
    return results
