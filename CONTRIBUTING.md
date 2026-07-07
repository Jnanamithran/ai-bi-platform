# Contributing to Inquira

Thank you for considering contributing to Inquira! We welcome contributions from everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

By participating in this project, you agree to be respectful, inclusive, and constructive. We do not tolerate harassment of any kind.

---

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/inquira.git
   cd inquira
   ```
3. Follow the [Development Setup](./docs/development.md) guide to get the project running locally
4. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## How to Contribute

### Good first issues
Look for issues labeled `good first issue` — these are beginner-friendly tasks that are a great place to start.

### Ways to contribute
- Fix bugs
- Add new features
- Improve documentation
- Add tests
- Improve UI/UX
- Add support for new database types
- Add support for new LLM providers

---

## Development Setup

See [docs/development.md](./docs/development.md) for full setup instructions.

**Quick start:**
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# AI Service
cd ai-service && pip install -r requirements.txt && python main.py
```

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     new feature
fix:      bug fix
docs:     documentation changes
style:    formatting, no logic change
refactor: code restructure
test:     adding tests
chore:    build process, dependencies
```

**Examples:**
```
feat: add support for MySQL schema introspection
fix: correct SQL validator injection pattern detection
docs: add API reference for query endpoints
```

---

## Pull Request Process

1. Make sure your branch is up to date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Run and verify the app works locally

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub targeting `main`

5. Fill in the PR template with:
   - What does this PR do?
   - How to test it?
   - Screenshots (if UI changes)

6. Wait for review — we aim to review PRs within 48 hours

7. Address any review comments

8. Once approved, your PR will be merged

---

## Reporting Bugs

Open an issue using the **Bug Report** template and include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your OS, Node version, Python version

---

## Suggesting Features

Open an issue using the **Feature Request** template and include:

- What problem does this solve?
- How should it work?
- Any alternatives you considered?

---

## Project Structure

```
inquira/
├── frontend/     # React + Vite (TypeScript-free JSX)
├── backend/      # Node.js + Express + Prisma
├── ai-service/   # Python + FastAPI + Groq/Ollama
└── docs/         # Documentation
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/Jnanamithran/inquira/discussions) or create an issue labeled `question`.
