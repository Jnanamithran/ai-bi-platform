import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ollama

from app.routes import sql

load_dotenv()

app = FastAPI(
    title="Inquira AI Service",
    description="Natural Language to SQL AI Engine",
    version="1.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5000,http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sql.router)


@app.get("/health")
def health():
    try:
        ollama.list()
        ollama_status = "connected"
    except Exception as exc:
        ollama_status = f"disconnected: {exc}"

    return {
        "status": "ok",
        "message": "Inquira AI Service is running",
        "ollama": ollama_status,
        "model": os.getenv("MODEL_NAME", "llama3.2"),
    }