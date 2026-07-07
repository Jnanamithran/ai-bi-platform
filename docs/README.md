# Inquira Documentation

> Ask Better. Know Faster.

Welcome to the Inquira documentation. Use the links below to navigate.

---

## Contents

| Document | Description |
|---|---|
| [Architecture](./architecture.md) | System architecture, services, and data flow |
| [API Reference](./api.md) | All backend API endpoints with request/response |
| [Frontend](./frontend.md) | Frontend structure, pages, and components |
| [Database](./database.md) | Database schema and model relationships |
| [Development](./development.md) | Local development setup guide |

---

## Quick Links

- **GitHub:** https://github.com/Jnanamithran/inquira
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **AI Service:** http://localhost:8000

---

## What is Inquira?

Inquira is a full-stack B2B SaaS platform that lets non-technical users query their business databases using plain English instead of SQL.

### The Problem

Organizations store valuable data in relational databases, but accessing insights requires SQL knowledge — creating dependency on developers and delays in reporting.

### The Solution

Inquira connects to existing databases and lets anyone ask questions in plain English. The AI translates the question into SQL, validates it for safety, executes it, and returns results with a plain-English summary.

---

## Three Services

```
Frontend (React)  →  Backend (Node.js)  →  AI Service (Python)
Port 5173             Port 5000              Port 8000
```