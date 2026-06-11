import pytesseract
from PIL import Image
import io
import os

def extract_text_from_image(image_content: bytes) -> str:
    try:
        # Set tesseract path if on Windows
        if os.name == 'nt':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        image = Image.open(io.BytesIO(image_content))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"OCR failed: {e}")
        return ""