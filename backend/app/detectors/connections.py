import re
from .models import Detection

def detect_connections(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|mssql|redis)://[^\s]+')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="DB_CONNECTION",
                value=match.group(),
                severity="critical",
                start=match.start(),
                end=match.end()
            )
        )
    return results
