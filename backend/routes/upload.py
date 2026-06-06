from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.storage import upload_file
from models.receipt import Receipt

router = APIRouter()

@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_url = await upload_file(file)

    receipt = Receipt(
        merchant="Pending",
        amount=0.0,
        file_url=file_url
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    return {
        "message": "Receipt uploaded successfully",
        "file_url": file_url,
        "receipt_id": str(receipt.id)
    }