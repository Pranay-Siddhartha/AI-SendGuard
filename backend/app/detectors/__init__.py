from .models import Detection

from .emails import detect_emails
from .phones import detect_phones
from .urls import detect_urls
from .pan import detect_pan
from .aadhaar import detect_aadhaar
from .credit_cards import detect_credit_cards
from .bank_accounts import detect_bank_accounts
from .api_keys import detect_api_keys
from .jwt_tokens import detect_jwt_tokens
from .passwords import detect_passwords
from .private_keys import detect_private_keys
from .connections import detect_connections

def run_all_detectors(text: str) -> list[Detection]:
    results = []
    results.extend(detect_emails(text))
    results.extend(detect_phones(text))
    results.extend(detect_urls(text))
    results.extend(detect_pan(text))
    results.extend(detect_aadhaar(text))
    results.extend(detect_credit_cards(text))
    results.extend(detect_bank_accounts(text))
    results.extend(detect_api_keys(text))
    results.extend(detect_jwt_tokens(text))
    results.extend(detect_passwords(text))
    results.extend(detect_private_keys(text))
    results.extend(detect_connections(text))
    return results
