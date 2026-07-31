import os
from .pdf_parser import parse_pdf
from .docx_parser import parse_docx
from .excel_parser import parse_excel
from .csv_parser import parse_csv
from .text_parser import parse_text

def extract_text(filename: str, file_bytes: bytes) -> str:
    """
    Master function to route file text extraction based on file extension.
    """
    _, ext = os.path.splitext(filename.lower())
    
    if ext == ".pdf":
        return parse_pdf(file_bytes)
    elif ext in [".docx", ".doc"]:
        return parse_docx(file_bytes)
    elif ext in [".xlsx", ".xls"]:
        return parse_excel(file_bytes)
    elif ext == ".csv":
        return parse_csv(file_bytes)
    elif ext in [".txt", ".md", ".log"]:
        return parse_text(file_bytes)
    else:
        # Default fallback to plain text parsing
        return parse_text(file_bytes)
