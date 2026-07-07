# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x | ✅ Yes |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Inquira, please **do not** open a public GitHub issue.

Instead, please report it privately by:

1. Going to the [GitHub Security Advisories](https://github.com/Jnanamithran/inquira/security/advisories/new) page
2. Or emailing the maintainer directly via GitHub

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge your report within 48 hours and work to resolve the issue as quickly as possible.

---

## Security Best Practices for Self-Hosting

When running Inquira yourself:

- Never commit `.env` files to version control
- Use a strong, random `JWT_SECRET` (at least 32 characters)
- Use a strong, random `ENCRYPTION_KEY` (exactly 32 characters)
- Always use `sslmode=require` in your `DATABASE_URL` for cloud databases
- Use a read-only database user for all database connections
- Keep your dependencies up to date
- Run behind HTTPS in production
- Rotate your database credentials regularly

---

## Known Security Considerations

- Database credentials are encrypted with AES-256-CBC before storage
- All SQL queries are validated to be read-only before execution
- JWT tokens expire after 7 days by default
- Passwords are hashed with bcrypt at 12 rounds
- All organizations are fully isolated from each other
