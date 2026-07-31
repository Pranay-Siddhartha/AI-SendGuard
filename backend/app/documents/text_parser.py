def parse_text(file_bytes: bytes) -> str:
    """Extract text from a plain text file."""
    try:
        return file_bytes.decode('utf-8').strip()
    except UnicodeDecodeError:
        # Fallback for other encodings if needed
        try:
            return file_bytes.decode('latin-1').strip()
        except Exception as e:
            return f"Error parsing Text: {e}"
    except Exception as e:
        return f"Error parsing Text: {e}"
