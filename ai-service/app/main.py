from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sql
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Inquira AI Service",
    description="Natural Language to SQL AI Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sql.router)

@app.get("/health")
def health():
    return {"status": "ok", "message": "Inquira AI Service is running"}