import re
from .models import Detection

def luhn_check(card_number: str) -> bool:
    digits = [int(c) for c in card_number if c.isdigit()]
    if not digits:
        return False
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0

def detect_credit_cards(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'\b(?:\d[ -]*?){13,16}\b')
    for match in pattern.finditer(text):
        val = match.group()
        if luhn_check(val):
            results.append(
                Detection(
                    type="CREDIT_CARD",
                    value=val,
                    severity="critical",
                    start=match.start(),
                    end=match.end()
                )
            )
    return results
