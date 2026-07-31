import pandas as pd
import io

def parse_csv(file_bytes: bytes) -> str:
    """Extract text from a CSV file."""
    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
        return df.to_csv(index=False).strip()
    except Exception as e:
        return f"Error parsing CSV: {e}"
