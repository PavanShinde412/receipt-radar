import pytesseract
from PIL import Image
import io
import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def extract_text_from_image(image_content: bytes) -> str:
    # Try Tesseract first (local)
    try:
        if os.name == 'nt':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        image = Image.open(io.BytesIO(image_content))
        text = pytesseract.image_to_string(image)
        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"Tesseract failed: {e}")

    # Fallback: use Groq vision model
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        base64_image = base64.b64encode(image_content).decode('utf-8')
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extract all text from this receipt image. Return only the raw text, nothing else."
                        }
                    ]
                }
            ],
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq vision failed: {e}")
        return ""