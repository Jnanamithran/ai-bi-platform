# API Reference

Base URL: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### POST /auth/register
Create a new user and organization.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "password123",
  "organizationName": "Acme Corp"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "cmr85...",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "OWNER"
  },
  "organization": {
    "id": "cmr85...",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "plan": "FREE"
  }
}
```

---

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "john@acme.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": { ... },
  "organization": { ... }
}
```

---

### GET /auth/me
Get current user info. Protected.

**Response (200):**
```json
{
  "user": {
    "id": "cmr85...",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "OWNER"
  },
  "organization": { ... }
}
```

---

### PATCH /auth/change-password
Change current user's password. Protected.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Organization

### GET /organization
Get organization details with members and connections. Protected.

### PATCH /organization
Update organization name/website. Protected. Owner/Admin only.

**Request:**
```json
{
  "name": "Acme Technologies",
  "website": "https://acme.com"
}
```

---

### GET /organization/members
Get all members. Protected.

**Response (200):**
```json
{
  "members": [
    {
      "id": "cmr85...",
      "name": "John Doe",
      "email": "john@acme.com",
      "role": "OWNER",
      "createdAt": "2026-07-05T..."
    }
  ]
}
```

---

### POST /organization/members
Invite a new member. Protected. Owner/Admin only.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "password": "temppassword",
  "role": "ANALYST"
}
```

---

### DELETE /organization/members/:userId
Remove a member. Protected. Owner/Admin only.

---

### PATCH /organization/members/:userId/role
Update a member's role. Protected. Owner only.

**Request:**
```json
{ "role": "ADMIN" }
```

---

### GET /organization/roles
Get all roles. Protected.

### POST /organization/roles
Create a custom role. Protected. Owner/Admin only.

**Request:**
```json
{
  "name": "Data Lead",
  "description": "Can run queries and manage connections",
  "permissions": ["run_queries", "view_dashboard", "manage_connections"]
}
```

### PATCH /organization/roles/:roleId
Update a custom role. Protected. Owner/Admin only.

### DELETE /organization/roles/:roleId
Delete a custom role. Protected. Owner/Admin only.

---

## Database Connections

### GET /databases
Get all connections. Protected.

**Response (200):**
```json
{
  "connections": [
    {
      "id": "cmr85...",
      "name": "production-db",
      "type": "POSTGRESQL",
      "host": "localhost",
      "port": 5432,
      "dbname": "mydb",
      "username": "readonly",
      "isActive": true,
      "lastSync": "2025-07-05T..."
    }
  ]
}
```

---

### POST /databases/test
Test a connection without saving. Protected.

**Request:**
```json
{
  "type": "POSTGRESQL",
  "host": "localhost",
  "port": "5432",
  "dbname": "mydb",
  "username": "readonly",
  "password": "secret"
}
```

**Response (200):**
```json
{ "message": "Connection successful" }
```

---

### POST /databases
Create a new connection. Protected. Owner/Admin only.

**Request:**
```json
{
  "name": "production-db",
  "type": "POSTGRESQL",
  "host": "localhost",
  "port": "5432",
  "dbname": "mydb",
  "username": "readonly",
  "password": "secret"
}
```

---

### DELETE /databases/:connectionId
Remove a connection. Protected. Owner/Admin only.

---

### GET /databases/:connectionId/schema
Get full schema for a connection. Protected.

**Response (200):**
```json
{
  "schema": [
    {
      "name": "products",
      "rowCount": 1240,
      "columns": [
        {
          "name": "id",
          "type": "INTEGER",
          "nullable": false,
          "isPrimaryKey": true,
          "isForeignKey": false
        },
        {
          "name": "name",
          "type": "VARCHAR",
          "nullable": false,
          "isPrimaryKey": false,
          "isForeignKey": false
        }
      ]
    }
  ]
}
```

---

## Queries

### POST /queries/run
Run a natural language query. Protected.

**Request:**
```json
{
  "question": "Show top 5 products by revenue this month",
  "connectionId": "cmr85..."
}
```

**Response (200):**
```json
{
  "query": {
    "id": "cmr85...",
    "question": "Show top 5 products by revenue this month",
    "sql": "SELECT product_name, SUM(revenue) AS total FROM sales...",
    "summary": "Product A generated the highest revenue at ₹2.4L...",
    "result": [
      { "product_name": "Product A", "total": 240000 }
    ],
    "fields": [
      { "name": "product_name" },
      { "name": "total" }
    ],
    "rowCount": 5,
    "executionTime": 42,
    "status": "SUCCESS"
  }
}
```

---

### GET /queries/history
Get query history. Protected.

**Query params:** `page`, `limit`

---

### GET /queries/:queryId
Get a single query. Protected.

---

### PATCH /queries/:queryId/save
Save a query to dashboard. Protected.

---

### GET /queries/audit
Get audit logs. Protected.

**Response (200):**
```json
{
  "logs": [
    {
      "id": "cmr85...",
      "action": "Ran query",
      "detail": "Show top 5 products by revenue",
      "createdAt": "2025-07-05T...",
      "user": { "name": "John Doe", "email": "john@acme.com" }
    }
  ],
  "total": 42
}
```

---

## AI Service

Base URL: `http://localhost:8000`

### GET /health
Health check.

**Response (200):**
```json
{ "status": "ok", "message": "Inquira AI Service is running" }
```

---

### POST /generate-sql
Generate SQL from natural language. Called by backend only.

**Request:**
```json
{
  "question": "Show top 5 products by revenue",
  "schema": [
    {
      "name": "products",
      "rowCount": 1240,
      "columns": [
        { "name": "id", "type": "INTEGER", "isPrimaryKey": true },
        { "name": "name", "type": "VARCHAR" }
      ]
    }
  ]
}
```

**Response (200):**
```json
{
  "sql": "SELECT p.name, SUM(s.revenue) AS total FROM products p JOIN sales s ON p.id = s.product_id GROUP BY p.name ORDER BY total DESC LIMIT 5;",
  "summary": "Product A generated the highest revenue this month at ₹2.4L, followed by Product B at ₹1.9L.",
  "model": "llama3.2"
}
```

---

## Error Responses

All errors follow this format:

```json
{ "error": "Error message here" }
```

| Status | Meaning |
|---|---|
| 400 | Bad request — invalid input |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not found |
| 409 | Conflict — e.g. email already exists |
| 500 | Internal server error |
| 503 | Service unavailable — e.g. AI service down |

---

## Roles & Permissions

| Role | Permissions |
|---|---|
| OWNER | Full access to everything |
| ADMIN | Everything except billing |
| ANALYST | Run queries, view/save dashboards, export data |
| VIEWER | View dashboards only |

Available permissions:
- `run_queries`
- `view_dashboard`
- `save_dashboard`
- `export_data`
- `manage_connections`
- `invite_members`
- `manage_roles`
- `billing`