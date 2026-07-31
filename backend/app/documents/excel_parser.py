import pandas as pd
import io

def parse_excel(file_bytes: bytes) -> str:
    """Extract text from an Excel file (.xls, .xlsx)."""
    try:
        # Read all sheets
        dfs = pd.read_excel(io.BytesIO(file_bytes), sheet_name=None)
        text = ""
        for sheet_name, df in dfs.items():
            text += f"Sheet: {sheet_name}\n"
            text += df.to_csv(index=False) + "\n"
        return text.strip()
    except Exception as e:
        return f"Error parsing Excel: {e}"
