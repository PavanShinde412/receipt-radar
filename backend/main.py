from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routes.upload import router as upload_router

app = FastAPI(title="ReceiptRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()

app.include_router(upload_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ReceiptRadar API is running"}