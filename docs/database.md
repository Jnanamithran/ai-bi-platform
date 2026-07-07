# Database

Inquira uses PostgreSQL as its platform database, managed with Prisma ORM.

---

## Models

### Organization
Represents a company or team workspace.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Organization name |
| slug | String (unique) | URL-friendly identifier |
| website | String? | Optional website URL |
| plan | Plan enum | FREE, PRO, ENTERPRISE |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

### User
A person belonging to an organization.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Full name |
| email | String (unique) | Email address |
| password | String | bcrypt hashed password |
| role | UserRole enum | OWNER, ADMIN, ANALYST, VIEWER |
| organizationId | String | FK to Organization |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

### Role
Custom roles defined per organization.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Role name |
| description | String? | Optional description |
| permissions | String[] | Array of permission strings |
| organizationId | String | FK to Organization |
| isSystem | Boolean | True for default roles |
| createdAt | DateTime | Creation timestamp |

**Available permissions:**
- `run_queries`
- `view_dashboard`
- `save_dashboard`
- `export_data`
- `manage_connections`
- `invite_members`
- `manage_roles`
- `billing`

---

### DatabaseConnection
A connected external database.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Display name |
| type | DbType enum | POSTGRESQL, MYSQL, MARIADB, SQLSERVER |
| host | String | Database host |
| port | Int | Database port |
| dbname | String | Database name |
| username | String | Database username |
| password | String | AES-256-CBC encrypted password |
| organizationId | String | FK to Organization |
| isActive | Boolean | Connection status |
| lastSync | DateTime? | Last schema sync time |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

### Query
A natural language query and its result.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| question | String | Original user question |
| sql | String? | Generated SQL query |
| result | Json? | Query result rows |
| summary | String? | AI-generated summary |
| status | QueryStatus enum | PENDING, SUCCESS, FAILED |
| executionTime | Int? | Execution time in ms |
| rowCount | Int? | Number of rows returned |
| savedToDash | Boolean | Pinned to dashboard |
| organizationId | String | FK to Organization |
| userId | String | FK to User |
| connectionId | String? | FK to DatabaseConnection |
| createdAt | DateTime | Creation timestamp |

---

### Dashboard
A saved collection of queries.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Dashboard name |
| description | String? | Optional description |
| isPinned | Boolean | Pinned to top |
| organizationId | String | FK to Organization |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

### AuditLog
A record of every user action.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| action | String | Action name (e.g. "Ran query") |
| detail | String? | Action detail |
| userId | String | FK to User |
| organizationId | String | FK to Organization |
| createdAt | DateTime | Timestamp |

---

## Enums

### Plan
```
FREE
PRO
ENTERPRISE
```

### UserRole
```
OWNER
ADMIN
ANALYST
VIEWER
```

### DbType
```
POSTGRESQL
MYSQL
MARIADB
SQLSERVER
```

### QueryStatus
```
PENDING
SUCCESS
FAILED
```

---

## Relationships

```
Organization
  ├── users (User[])
  ├── databases (DatabaseConnection[])
  ├── queries (Query[])
  ├── dashboards (Dashboard[])
  ├── auditLogs (AuditLog[])
  └── roles (Role[])

User
  ├── organization (Organization)
  ├── queries (Query[])
  └── auditLogs (AuditLog[])

DatabaseConnection
  ├── organization (Organization)
  └── queries (Query[])

Query
  ├── organization (Organization)
  ├── user (User)
  └── connection (DatabaseConnection?)
```

---

## Migrations

Migrations are stored in `backend/prisma/migrations/`.

**Run migrations:**
```bash
cd backend
npx prisma migrate dev --name <migration-name>
```

**Reset database:**
```bash
npx prisma migrate reset
```

**Open Prisma Studio:**
```bash
npx prisma studio
```

---

## Credential Encryption

Database passwords are encrypted before storage using AES-256-CBC:

```
plaintext password
        ↓
Random 16-byte IV generated
        ↓
AES-256-CBC encryption with ENCRYPTION_KEY
        ↓
Stored as: "iv_hex:encrypted_hex"
```

The `ENCRYPTION_KEY` must be 32 characters and stored in `.env`. It is never committed to version control.