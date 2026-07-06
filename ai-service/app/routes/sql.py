from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.nlsql import generate_sql
from typing import List, Dict, Any

router = APIRouter()

class Column(BaseModel):
    name: str
    type: str
    nullable: bool = True
    isPrimaryKey: bool = False
    isForeignKey: bool = False
    foreignTable: str = None

class Table(BaseModel):
    name: str
    rowCount: int = 0
    columns: List[Column]

class SQLRequest(BaseModel):
    question: str
    schema: List[Table]

@router.post("/generate-sql")
async def generate_sql_endpoint(request: SQLRequest):
    try:
        result = await generate_sql(request.question, request.schema)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))