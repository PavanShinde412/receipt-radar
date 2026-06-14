from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routes.upload import router as upload_router
from routes.receipts import router as receipts_router
from routes.alerts import router as alerts_router

app = FastAPI(title="ReceiptRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()

app.include_router(upload_router, prefix="/api")
app.include_router(receipts_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ReceiptRadar API is running"}