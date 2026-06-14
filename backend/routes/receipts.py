from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.receipt import Receipt
from pydantic import BaseModel
from datetime import date
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

router = APIRouter()

class WarrantyUpdate(BaseModel):
    warranty_expiry: date

@router.get("/receipts")
def get_all_receipts(db: Session = Depends(get_db)):
    receipts = db.query(Receipt).order_by(Receipt.created_at.desc()).all()
    return [
        {
            "id": str(r.id),
            "merchant": r.merchant,
            "amount": r.amount,
            "date": str(r.date),
            "category": r.category,
            "file_url": r.file_url,
            "warranty_expiry": str(r.warranty_expiry) if r.warranty_expiry else None,
            "created_at": str(r.created_at)
        }
        for r in receipts
    ]

@router.patch("/receipts/{receipt_id}/warranty")
def update_warranty(receipt_id: str, data: WarrantyUpdate, db: Session = Depends(get_db)):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    receipt.warranty_expiry = data.warranty_expiry
    db.commit()
    return {"message": "Warranty date updated", "warranty_expiry": str(receipt.warranty_expiry)}

@router.delete("/receipts/{receipt_id}")
def delete_receipt(receipt_id: str, db: Session = Depends(get_db)):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    db.delete(receipt)
    db.commit()
    return {"message": "Receipt deleted successfully"}