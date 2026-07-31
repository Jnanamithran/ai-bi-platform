import os
import re

import ollama


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
    model_name = os.getenv("MODEL_NAME", "llama3.2")

    prompt = f"""You are an expert SQL assistant. Convert the natural language question into an accurate SQL SELECT query.

DATABASE SCHEMA:
{schema_text}

RULES:
1. Only generate SELECT queries — never INSERT, UPDATE, DELETE, DROP, or ALTER
2. Use exact table and column names from the schema
3. Use JOINs when data from multiple tables is needed
4. Return ONLY the SQL query inside ```sql ``` code blocks
5. No explanations — just the SQL

USER QUESTION: {question}

SQL QUERY:"""

    try:
        sql_response = ollama.chat(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are a SQL expert. Always respond with only a SQL SELECT query inside ```sql ``` code blocks. Never write explanations.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        raw_sql = sql_response.get("message", {}).get("content", "")
        sql = extract_sql(raw_sql)
        if not sql:
            raise ValueError("No SQL was generated")

        summary_response = ollama.chat(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": f'Write a 1-2 sentence plain English business summary. Question: "{question}". SQL: {sql}. Be concise and business-focused.',
                }
            ],
        )

        summary = summary_response.get("message", {}).get("content", "").strip()

        return {
            "sql": sql,
            "summary": summary,
            "model": model_name,
        }

    except Exception as exc:
        raise Exception(f"Ollama error: {str(exc)}")