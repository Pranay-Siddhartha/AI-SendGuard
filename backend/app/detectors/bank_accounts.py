import re
from .models import Detection

def detect_bank_accounts(text: str) -> list[Detection]:
    results = []
    # Generic bank account number regex (often 9 to 18 digits)
    # Exclude exactly 10 digits to prevent false positives with phone numbers
    pattern = re.compile(r'\b(?!\d{10}\b)\d{9,18}\b')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="BANK_ACCOUNT",
                value=match.group(),
                severity="high",
                start=match.start(),
                end=match.end()
            )
        )
    return results
