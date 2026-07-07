import os
from groq import Groq
import re
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def build_schema_prompt(schema) -> str:
    lines = []
    for table in schema:
        cols = []
        for col in table.columns:
            col_def = f"  - {col.name} ({col.type})"
            if col.isPrimaryKey:
                col_def += " [PRIMARY KEY]"
            if col.isForeignKey and col.foreignTable:
                col_def += f" [FK -> {col.foreignTable}]"
            cols.append(col_def)
        lines.append(f"Table: {table.name} ({table.rowCount} rows)")
        lines.extend(cols)
        lines.append("")
    return "\n".join(lines)

def extract_sql(text: str) -> str:
    code_block = re.search(r"```sql\s*(.*?)\s*```", text, re.DOTALL | re.IGNORECASE)
    if code_block:
        return code_block.group(1).strip()
    plain_block = re.search(r"```\s*(SELECT.*?)\s*```", text, re.DOTALL | re.IGNORECASE)
    if plain_block:
        return plain_block.group(1).strip()
    select_match = re.search(r"(SELECT\s+.*?;)", text, re.DOTALL | re.IGNORECASE)
    if select_match:
        return select_match.group(1).strip()
    return text.strip()

async def generate_sql(question: str, schema: list) -> dict:
    schema_text = build_schema_prompt(schema)

    prompt = f"""You are an expert SQL assistant. Convert the natural language question into an accurate SQL SELECT query.

DATABASE SCHEMA:
{schema_text}

RULES:
1. Only generate SELECT queries
2. Use exact table and column names from the schema
3. Use JOINs when needed
4. Return ONLY the SQL inside ```sql ``` code blocks
5. No explanations

USER QUESTION: {question}

SQL QUERY:"""

    sql_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a SQL expert. Always respond with only a SQL SELECT query inside ```sql ``` code blocks."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=1000,
    )

    raw_sql = sql_response.choices[0].message.content
    sql = extract_sql(raw_sql)

    summary_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": f'Write a 1-2 sentence plain English business summary. Question: "{question}". SQL: {sql}. Be concise.'}
        ],
        temperature=0.3,
        max_tokens=200,
    )

    summary = summary_response.choices[0].message.content.strip()

    return {
        "sql": sql,
        "summary": summary,
        "model": "llama-3.3-70b-versatile"
    }