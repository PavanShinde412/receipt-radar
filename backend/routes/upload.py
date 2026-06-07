from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.storage import upload_file_from_bytes
from services.ocr import extract_text_from_image
from services.parser import parse_receipt_text
from models.receipt import Receipt
from datetime import datetime

router = APIRouter()

@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()

    file_url = await upload_file_from_bytes(contents, file.filename)
    raw_text = extract_text_from_image(contents)
    parsed = parse_receipt_text(raw_text)

    date = None
    if parsed.get("date"):
        try:
            date = datetime.strptime(parsed["date"], "%Y-%m-%d").date()
        except:
            date = None

    receipt = Receipt(
        merchant=parsed.get("merchant", "Unknown"),
        amount=parsed.get("amount", 0.0),
        date=date,
        category=parsed.get("category", "Other"),
        file_url=file_url,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    return {
        "message": "Receipt processed successfully",
        "receipt_id": str(receipt.id),
        "file_url": file_url,
        "extracted": {
            "merchant": receipt.merchant,
            "amount": receipt.amount,
            "date": str(receipt.date),
            "category": receipt.category
        }
    }