import re
from .models import Detection

def detect_private_keys(text: str) -> list[Detection]:
    results = []
    pattern = re.compile(r'-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[^-]+-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----')
    for match in pattern.finditer(text):
        results.append(
            Detection(
                type="PRIVATE_KEY",
                value=match.group(),
                severity="critical",
                start=match.start(),
                end=match.end()
            )
        )
    return results
