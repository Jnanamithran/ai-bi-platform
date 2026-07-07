# Development Setup

Complete guide to running Inquira locally.

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| Python | 3.12+ | https://python.org |
| PostgreSQL | 17+ | https://postgresql.org/download |
| Ollama | Latest | https://ollama.com/download |
| Git | Latest | https://git-scm.com |

---

## 1. Clone the Repository

```bash
git clone https://github.com/Jnanamithran/inquira.git
cd inquira
```

---

## 2. PostgreSQL Setup

### Create the database
```bash
psql -U postgres
```

```sql
CREATE DATABASE inquira_db;
\q
```

---

## 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` from example:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/inquira_db"
JWT_SECRET=inquira_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=inquira_encryption_key_32_chars!!
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

Run Prisma migration:
```bash
npx prisma migrate dev
```

Start the backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

Test it:
```bash
curl http://localhost:5000/health
```

---

## 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 5. AI Service Setup

```bash
cd ai-service
```

Create virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the AI service:
```bash
python main.py
```

AI Service runs at: `http://localhost:8000`

---

## 6. Ollama Setup

Install Ollama from https://ollama.com/download

Pull the Llama 3.2 model (~2GB):
```bash
ollama pull llama3.2
```

Verify Ollama is running:
```bash
ollama list
```

---

## 7. Running All Services

Open 3 separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 — AI Service:**
```bash
cd ai-service
venv\Scripts\activate  # Windows
python main.py
```

---

## 8. First Time Setup

1. Open `http://localhost:5173`
2. Click **Get Started** on the landing page
3. Register with your name, email, password, and organization name
4. Go through the onboarding flow
5. Connect a database (use your local PostgreSQL or any test database)
6. Ask a question about your data

---

## Branching Strategy

```
main          → stable, production-ready
develop       → integration branch
feature/*     → individual features
fix/*         → bug fixes
```

**Workflow:**
```bash
# Create a feature branch from develop
git checkout develop
git checkout -b feature/your-feature

# Work on your feature
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature

# Create PR to develop on GitHub
# After review, merge to develop
# When ready, merge develop to main
```

---

## Commit Message Format

Follow conventional commits:

```
feat:     new feature
fix:      bug fix
docs:     documentation changes
style:    formatting, no logic change
refactor: code restructure, no feature change
test:     adding tests
chore:    build process, dependencies
```

**Examples:**
```
feat: add database connection test endpoint
fix: correct SQL validator injection pattern
docs: update API reference with new endpoints
refactor: extract encryption logic to utils
```

---

## Environment Variables Reference

### Backend
| Variable | Required | Description |
|---|---|---|
| PORT | No | Server port (default: 5000) |
| CLIENT_URL | Yes | Frontend URL for CORS |
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Secret for JWT signing |
| JWT_EXPIRES_IN | No | Token expiry (default: 7d) |
| ENCRYPTION_KEY | Yes | 32-char key for AES encryption |
| AI_SERVICE_URL | No | AI service URL (default: http://localhost:8000) |
| NODE_ENV | No | development or production |

### Frontend
| Variable | Required | Description |
|---|---|---|
| VITE_API_URL | Yes | Backend API base URL |

---

## Common Issues

### PostgreSQL not found in PATH (Windows)
Add PostgreSQL bin to PATH:
```
C:\Program Files\PostgreSQL\17\bin
```

### Python not found
Use `py` instead of `python` on Windows:
```bash
py -m venv venv
```

### Ollama not found
Open a new terminal after installation. If still not found, add Ollama to PATH manually.

### Prisma migration fails
Make sure `DATABASE_URL` in `.env` is correct and PostgreSQL is running.

### AI service null bytes error
Recreate `__init__.py` files using PowerShell:
```powershell
[System.IO.File]::WriteAllText("ai-service\app\__init__.py", "")
[System.IO.File]::WriteAllText("ai-service\app\routes\__init__.py", "")
[System.IO.File]::WriteAllText("ai-service\app\services\__init__.py", "")
```

### CORS error in frontend
Make sure `CLIENT_URL` in backend `.env` matches the frontend URL exactly.

---

## Prisma Commands

```bash
# Run migrations
npx prisma migrate dev --name <name>

# Generate client after schema changes
npx prisma generate

# Open database GUI
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```