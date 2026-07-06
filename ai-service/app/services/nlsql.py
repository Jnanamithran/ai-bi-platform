import ollama
import json
import re
from typing import List

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
    # Try to extract SQL from code blocks
    code_block = re.search(r'```sql\s*(.*?)\s*```', text, re.DOTALL | re.IGNORECASE)
    if code_block:
        return code_block.group(1).strip()

    # Try plain code block
    plain_block = re.search(r'```\s*(SELECT.*?)\s*```', text, re.DOTALL | re.IGNORECASE)
    if plain_block:
        return plain_block.group(1).strip()

    # Try to find SELECT statement directly
    select_match = re.search(r'(SELECT\s+.*?;)', text, re.DOTALL | re.IGNORECASE)
    if select_match:
        return select_match.group(1).strip()

    # Return as is and let validator handle it
    return text.strip()

async def generate_sql(question: str, schema: list) -> dict:
    schema_text = build_schema_prompt(schema)

    prompt = f"""You are an expert SQL assistant. Your job is to convert natural language questions into accurate SQL SELECT queries.

DATABASE SCHEMA:
{schema_text}

RULES:
1. Only generate SELECT queries — never INSERT, UPDATE, DELETE, DROP, or ALTER
2. Use proper table and column names exactly as shown in the schema
3. Use JOINs when data from multiple tables is needed
4. Always use aliases for clarity
5. Return ONLY the SQL query inside ```sql ``` code blocks
6. Do not explain — just return the SQL

USER QUESTION: {question}

SQL QUERY:"""

    try:
        response = ollama.chat(
            model="llama3.2",
            messages=[
                {
                    "role": "system",
                    "content": "You are a SQL expert. Always respond with only a SQL SELECT query inside ```sql ``` code blocks. Never write explanations."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw_response = response['message']['content']
        sql = extract_sql(raw_response)

        # Generate summary prompt
        summary_prompt = f"""Given this SQL query result for the question "{question}", write a 1-2 sentence plain English business summary of what the data shows. Be concise and business-focused.

SQL: {sql}

Summary:"""

        summary_response = ollama.chat(
            model="llama3.2",
            messages=[
                {
                    "role": "user",
                    "content": summary_prompt
                }
            ]
        )

        summary = summary_response['message']['content'].strip()

        return {
            "sql": sql,
            "summary": summary,
            "model": "llama3.2"
        }

    except Exception as e:
        raise Exception(f"AI generation failed: {str(e)}")