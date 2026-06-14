from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.receipt import Receipt
from services.email import send_warranty_alert
from datetime import date

router = APIRouter()

@router.post("/alerts/check")
def check_warranty_alerts(email: str, db: Session = Depends(get_db)):
    receipts = db.query(Receipt).all()
    alerts_sent = 0

    for r in receipts:
        print(f"Checking: {r.merchant} | warranty: {r.warranty_expiry}")
        if not r.warranty_expiry:
            continue
        days_left = (r.warranty_expiry - date.today()).days
        print(f"Days left: {days_left}")
        if 0 < days_left <= 30:
            sent = send_warranty_alert(
                to_email=email,
                merchant=r.merchant or "Unknown",
                warranty_expiry=str(r.warranty_expiry),
                days_left=days_left
            )
            if sent:
                alerts_sent += 1

    return {"message": f"{alerts_sent} alert(s) sent"}