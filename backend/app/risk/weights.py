ENTITY_WEIGHTS = {
    "EMAIL": 5,
    "PHONE": 5,
    "URL": 0,
    "PAN": 25,
    "AADHAAR": 40,
    "CREDIT_CARD": 35,
    "BANK_ACCOUNT": 30,
    "API_KEY": 35,
    "JWT_TOKEN": 30,
    "PASSWORD": 40,
    "PRIVATE_KEY": 40,
    "CONNECTION": 40
}

SEMANTIC_WEIGHTS = {
    "document_type": {
        "Payroll Report": 30,
        "HR Document": 20,
        "Financial Report": 25,
        "Source Code": 20,
        "Internal Memo": 10,
        "Invoice": 10
    },
    "flags": {
        "is_external": 20,
        "contains_sensitive_information": 30
    }
}
