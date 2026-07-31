from pydantic import BaseModel
from typing import Tuple, Optional

class Detection(BaseModel):
    type: str
    value: str
    confidence: float = 1.0
    start: int
    end: int
    severity: str
