import re
from .models import Detection

def detect_pan(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'[A-Z]{5}[0-9]{4}[A-Z]{1}')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="PAN",
                value=match.group(),
                severity="high",
                start=match.start(),
                end=match.end()
            )
        )
    return results
