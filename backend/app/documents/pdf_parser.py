import fitz

def parse_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
    except Exception as e:
        return f"Error parsing PDF: {e}"
    return text.strip()
