from docx import Document
import io

def parse_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"Error parsing DOCX: {e}"
