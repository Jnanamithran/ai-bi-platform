// ─── SQL Safety Validator ─────────────────────────────────────────────────────
// Only SELECT queries are allowed — no writes, no DDL, no injections

const BLOCKED_KEYWORDS = [
  'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE',
  'TRUNCATE', 'REPLACE', 'MERGE', 'EXEC', 'EXECUTE',
  'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
  'CALL', 'DO', 'HANDLER', 'LOAD', 'IMPORT',
]

const INJECTION_PATTERNS = [
  /;\s*DROP/i,
  /;\s*DELETE/i,
  /;\s*INSERT/i,
  /;\s*UPDATE/i,
  /;\s*ALTER/i,
  /;\s*CREATE/i,
  /--/,
  /\/\*/,
  /xp_/i,
  /UNION\s+SELECT/i,
]

const validateSQL = (sql) => {
  if (!sql || typeof sql !== 'string') {
    return { valid: false, error: 'No SQL provided' }
  }

  const trimmed = sql.trim()

  // Must start with SELECT
  if (!trimmed.toUpperCase().startsWith('SELECT')) {
    return { valid: false, error: 'Only SELECT queries are allowed' }
  }

  // Check for blocked keywords
  const upperSQL = trimmed.toUpperCase()
  for (const keyword of BLOCKED_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword}\\b`)
    if (pattern.test(upperSQL)) {
      return { valid: false, error: `Blocked keyword detected: ${keyword}` }
    }
  }

  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Potential SQL injection detected' }
    }
  }

  // No multiple statements
  const statements = trimmed.split(';').filter(s => s.trim().length > 0)
  if (statements.length > 1) {
    return { valid: false, error: 'Multiple statements are not allowed' }
  }

  return { valid: true }
}

module.exports = { validateSQL }