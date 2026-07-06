const { Client } = require('pg')

// ─── Test Connection ──────────────────────────────────────────────────────────
const testConnection = async ({ type, host, port, dbname, username, password }) => {
  if (type === 'POSTGRESQL' || type === 'MARIADB') {
    const client = new Client({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
      connectionTimeoutMillis: 5000,
    })
    await client.connect()
    await client.end()
    return true
  }

  if (type === 'MYSQL') {
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
      connectTimeout: 5000,
    })
    await conn.end()
    return true
  }

  throw new Error(`Unsupported database type: ${type}`)
}

// ─── Get Schema ───────────────────────────────────────────────────────────────
const getSchema = async ({ type, host, port, dbname, username, password }) => {
  if (type === 'POSTGRESQL' || type === 'MARIADB') {
    const client = new Client({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
      connectionTimeoutMillis: 5000,
    })

    await client.connect()

    // Get tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    const tables = []

    for (const row of tablesResult.rows) {
      const tableName = row.table_name

      // Get columns
      const columnsResult = await client.query(`
        SELECT
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key,
          CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END as is_foreign_key,
          fk.foreign_table_name
        FROM information_schema.columns c
        LEFT JOIN (
          SELECT ku.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage ku
            ON tc.constraint_name = ku.constraint_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_name = $1
        ) pk ON c.column_name = pk.column_name
        LEFT JOIN (
          SELECT
            ku.column_name,
            ccu.table_name AS foreign_table_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage ku
            ON tc.constraint_name = ku.constraint_name
          JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
        ) fk ON c.column_name = fk.column_name
        WHERE c.table_name = $1
        AND c.table_schema = 'public'
        ORDER BY c.ordinal_position
      `, [tableName])

      // Get row count
      const countResult = await client.query(
        `SELECT COUNT(*) as count FROM "${tableName}"`
      )

      tables.push({
        name: tableName,
        rowCount: parseInt(countResult.rows[0].count),
        columns: columnsResult.rows.map(col => ({
          name: col.column_name,
          type: col.data_type.toUpperCase(),
          nullable: col.is_nullable === 'YES',
          default: col.column_default,
          isPrimaryKey: col.is_primary_key,
          isForeignKey: col.is_foreign_key,
          foreignTable: col.foreign_table_name,
        })),
      })
    }

    await client.end()
    return tables
  }

  if (type === 'MYSQL') {
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
    })

    const [tables] = await conn.query(`
      SELECT table_name, table_rows
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_type = 'BASE TABLE'
    `, [dbname])

    const result = []

    for (const table of tables) {
      const [columns] = await conn.query(`
        SELECT
          COLUMN_NAME as column_name,
          DATA_TYPE as data_type,
          IS_NULLABLE as is_nullable,
          COLUMN_KEY as column_key
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `, [dbname, table.table_name])

      result.push({
        name: table.table_name,
        rowCount: table.table_rows,
        columns: columns.map(col => ({
          name: col.column_name,
          type: col.data_type.toUpperCase(),
          nullable: col.is_nullable === 'YES',
          isPrimaryKey: col.column_key === 'PRI',
          isForeignKey: col.column_key === 'MUL',
        })),
      })
    }

    await conn.end()
    return result
  }

  throw new Error(`Unsupported database type: ${type}`)
}

// ─── Execute Query ────────────────────────────────────────────────────────────
const executeQuery = async ({ type, host, port, dbname, username, password }, sql) => {
  if (type === 'POSTGRESQL' || type === 'MARIADB') {
    const client = new Client({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
      connectionTimeoutMillis: 5000,
    })

    await client.connect()
    const start = Date.now()
    const result = await client.query(sql)
    const executionTime = Date.now() - start
    await client.end()

    return {
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map(f => ({ name: f.name })),
      executionTime,
    }
  }

  if (type === 'MYSQL') {
    const mysql = require('mysql2/promise')
    const conn = await mysql.createConnection({
      host,
      port: parseInt(port),
      database: dbname,
      user: username,
      password,
    })

    const start = Date.now()
    const [rows, fields] = await conn.query(sql)
    const executionTime = Date.now() - start
    await conn.end()

    return {
      rows,
      rowCount: rows.length,
      fields: fields.map(f => ({ name: f.name })),
      executionTime,
    }
  }

  throw new Error(`Unsupported database type: ${type}`)
}

module.exports = { testConnection, getSchema, executeQuery }