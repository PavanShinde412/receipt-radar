from sqlalchemy import Column, String, Float, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

Base = declarative_base()

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    merchant = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=True)
    category = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    warranty_expiry = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)