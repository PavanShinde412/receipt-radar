from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

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

@app.get("/")
def root():
    return {"message": "ReceiptRadar API is running"}