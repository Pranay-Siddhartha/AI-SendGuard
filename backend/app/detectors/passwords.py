import re
from .models import Detection

def detect_passwords(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'(?i)(?:password|passwd|pwd)["\'\s]*[:=]["\'\s]*([^\s"\'\\]{6,})')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="PASSWORD",
                value=match.group(1),
                severity="critical",
                start=match.start(),
                end=match.end()
            )
        )
    return results
