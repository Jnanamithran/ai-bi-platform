# Architecture

## Overview

Inquira is a monorepo with three independent services that work together.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP
┌─────────────────────────▼───────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│                       Port 5173                              │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (Axios)
┌─────────────────────────▼───────────────────────────────────┐
│                  Backend (Node.js + Express)                  │
│                       Port 5000                              │
│                                                              │
│  Auth │ Organization │ Database Connections │ Query Engine   │
└──────────────┬──────────────────┬───────────────────────────┘
               │                  │
    ┌──────────▼───┐    ┌─────────▼──────────┐
    │  Inquira DB  │    │    AI Service       │
    │  PostgreSQL  │    │  FastAPI + Ollama   │
    │  Port 5432   │    │  Port 8000          │
    └──────────────┘    └─────────────────────┘
                                  │
                        ┌─────────▼──────────┐
                        │   Ollama (Local)    │
                        │   Llama 3.2 LLM     │
                        │   Port 11434        │
                        └─────────────────────┘
```

---

## Services

### 1. Frontend — React + Vite
**Port:** 5173

The user-facing interface built with React 19 and Vite. Handles:
- Authentication UI (login, register, onboarding)
- Natural language query input
- Results display (tables, AI summaries)
- Schema explorer
- Dashboard, settings, audit logs

**Key libraries:**
- React Router — client-side routing
- Framer Motion — animations
- Axios — API calls
- TanStack Query — server state management
- Tailwind CSS — styling

---

### 2. Backend — Node.js + Express
**Port:** 5000

The main API server. Handles:
- JWT authentication
- Multi-tenant organization management
- Encrypted database credential storage
- Schema introspection from user databases
- SQL safety validation
- Query execution on user databases
- Audit logging

**Key libraries:**
- Express — HTTP server
- Prisma — ORM for Inquira's own PostgreSQL database
- bcryptjs — password hashing
- jsonwebtoken — JWT generation and verification
- pg, mysql2 — database drivers for user connections
- crypto — AES-256-CBC encryption for credentials

---

### 3. AI Service — Python + FastAPI
**Port:** 8000

The NL-to-SQL AI engine. Handles:
- Receiving natural language questions + schema
- Building prompts for the LLM
- Calling Ollama (local Llama 3.2)
- Extracting clean SQL from LLM response
- Generating plain-English summaries

**Key libraries:**
- FastAPI — async Python web framework
- Uvicorn — ASGI server
- Ollama — Python client for local LLM
- Pydantic — request/response validation

---

### 4. Ollama (Local LLM)
**Port:** 11434

Runs the Llama 3.2 model locally. No external API calls — all AI inference happens on the user's machine. This means:
- Zero API costs
- Data never leaves the machine
- Works offline

---

## Query Flow

```
1. User types: "Show top 5 products by revenue"
        ↓
2. Frontend → POST /api/queries/run
   { question, connectionId }
        ↓
3. Backend verifies JWT token
        ↓
4. Backend fetches database connection (decrypts password)
        ↓
5. Backend introspects schema (tables, columns, relationships)
        ↓
6. Backend → POST http://localhost:8000/generate-sql
   { question, schema }
        ↓
7. AI Service builds prompt with schema context
        ↓
8. AI Service → Ollama (Llama 3.2)
        ↓
9. Llama generates SQL query
        ↓
10. AI Service extracts SQL, generates summary
        ↓
11. Backend receives { sql, summary }
        ↓
12. Backend validates SQL:
    ✓ Starts with SELECT
    ✓ No blocked keywords (INSERT, UPDATE, DELETE, DROP...)
    ✓ No injection patterns
    ✓ Single statement only
        ↓
13. Backend executes SQL on user's database (read-only)
        ↓
14. Results returned to frontend
        ↓
15. Frontend displays table + SQL + AI summary
```

---

## Security Architecture

### Authentication
- JWT tokens with 7-day expiry
- Passwords hashed with bcrypt (12 rounds)
- Token verified on every protected request

### Database Credentials
- Stored encrypted with AES-256-CBC
- IV is randomly generated per encryption
- Never returned in API responses

### SQL Safety
- All generated SQL validated before execution
- Only SELECT statements allowed
- Blocks: INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, EXEC
- Detects SQL injection patterns
- No multiple statements

### Multi-Tenancy
- Every database query filtered by organizationId
- Users can only access their own organization's data
- Complete tenant isolation at the data layer

---

## Database Architecture

Inquira uses **two separate databases**:

### 1. Inquira's Own Database
Stores platform data: users, organizations, connections, queries, audit logs.
Managed by Prisma ORM.

### 2. User's Business Database
The database the user connects to Inquira. Could be PostgreSQL, MySQL, MariaDB, or SQL Server. Inquira connects to it with read-only credentials at query time.

---

## Folder Structure

```
inquira/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── landing/     # Landing page components
│   │   ├── layouts/         # Page wrapper layouts
│   │   ├── pages/           # Route-level pages
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── dashboard/   # Dashboard
│   │   │   ├── query/       # Query page
│   │   │   ├── settings/    # Settings
│   │   │   ├── schema/      # Schema explorer
│   │   │   ├── saved/       # Saved dashboards
│   │   │   ├── reports/     # Reports
│   │   │   ├── audit/       # Audit logs
│   │   │   ├── connect/     # Connect database
│   │   │   ├── onboarding/  # Onboarding flow
│   │   │   └── landing/     # Landing page
│   │   ├── services/        # API service layer
│   │   └── store/           # Auth context
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/          # Prisma client, DB connector
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # Express routes
│   │   └── utils/           # JWT helpers, SQL validator
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── ai-service/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── routes/
│   │   │   └── sql.py       # /generate-sql endpoint
│   │   └── services/
│   │       └── nlsql.py     # NL-to-SQL logic
│   └── main.py              # Entry point
│
└── docs/                    # This documentation
```