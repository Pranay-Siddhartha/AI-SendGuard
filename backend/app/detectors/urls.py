import re
from .models import Detection

def detect_urls(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="URL",
                value=match.group(),
                severity="low",
                start=match.start(),
                end=match.end()
            )
        )
    return results
