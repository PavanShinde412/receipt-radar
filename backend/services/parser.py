import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_receipt_text(raw_text: str) -> dict:
    prompt = f"""
You are a receipt parser. Extract the following fields from this receipt text and return ONLY a valid JSON object with no extra text:

{{
  "merchant": "store or company name",
  "amount": total amount as a number,
  "date": "date in YYYY-MM-DD format or null",
  "category": "one of: Food, Electronics, Clothing, Medical, Travel, Utilities, Other"
}}

Receipt text:
{raw_text}

Return ONLY the JSON object, nothing else.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    result = response.choices[0].message.content.strip()

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {
            "merchant": "Unknown",
            "amount": 0.0,
            "date": None,
            "category": "Other"
        }