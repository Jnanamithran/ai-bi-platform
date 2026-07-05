const prisma = require('../config/prisma')
const { validateSQL } = require('../utils/sqlValidator')
const { executeQuery, getSchema } = require('../config/dbConnector')
const crypto = require('crypto')

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'inquira_default_encryption_key_32'
const ALGORITHM = 'aes-256-cbc'

const decrypt = (text) => {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
}

// ─── Run Query ────────────────────────────────────────────────────────────────
const runQuery = async (req, res) => {
  try {
    const { question, connectionId } = req.body

    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    if (!connectionId) {
      return res.status(400).json({ error: 'Database connection is required' })
    }

    // Get connection
    const connection = await prisma.databaseConnection.findFirst({
      where: { id: connectionId, organizationId: req.user.organizationId },
    })

    if (!connection) {
      return res.status(404).json({ error: 'Database connection not found' })
    }

    const decryptedPassword = decrypt(connection.password)
    const connConfig = {
      type: connection.type,
      host: connection.host,
      port: connection.port,
      dbname: connection.dbname,
      username: connection.username,
      password: decryptedPassword,
    }

    // Get schema for AI
    const schema = await getSchema(connConfig)

    // Create pending query record
    const queryRecord = await prisma.query.create({
      data: {
        question,
        status: 'PENDING',
        userId: req.user.id,
        organizationId: req.user.organizationId,
        connectionId,
      },
    })

    // Call AI service
    let generatedSQL = null
    let summary = null

    try {
      const aiResponse = await fetch(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/generate-sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, schema }),
      })

      if (!aiResponse.ok) {
        throw new Error('AI service unavailable')
      }

      const aiData = await aiResponse.json()
      generatedSQL = aiData.sql
      summary = aiData.summary
    } catch (aiErr) {
      console.error('AI service error:', aiErr)

      await prisma.query.update({
        where: { id: queryRecord.id },
        data: { status: 'FAILED' },
      })

      return res.status(503).json({ error: 'AI service unavailable. Please try again later.' })
    }

    // Validate SQL
    const validation = validateSQL(generatedSQL)
    if (!validation.valid) {
      await prisma.query.update({
        where: { id: queryRecord.id },
        data: { status: 'FAILED', sql: generatedSQL },
      })

      return res.status(400).json({ error: `Invalid SQL generated: ${validation.error}` })
    }

    // Execute query
    let result = null
    try {
      result = await executeQuery(connConfig, generatedSQL)
    } catch (execErr) {
      await prisma.query.update({
        where: { id: queryRecord.id },
        data: { status: 'FAILED', sql: generatedSQL },
      })

      return res.status(400).json({ error: `Query execution failed: ${execErr.message}` })
    }

    // Update query record with results
    const updatedQuery = await prisma.query.update({
      where: { id: queryRecord.id },
      data: {
        sql: generatedSQL,
        result: result.rows,
        summary,
        status: 'SUCCESS',
        executionTime: result.executionTime,
        rowCount: result.rowCount,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Ran query',
        detail: question,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({
      query: {
        id: updatedQuery.id,
        question,
        sql: generatedSQL,
        summary,
        result: result.rows,
        fields: result.fields,
        rowCount: result.rowCount,
        executionTime: result.executionTime,
        status: 'SUCCESS',
      },
    })
  } catch (err) {
    console.error('RunQuery error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Query History ────────────────────────────────────────────────────────
const getQueryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const queries = await prisma.query.findMany({
      where: { organizationId: req.user.organizationId },
      select: {
        id: true,
        question: true,
        sql: true,
        status: true,
        rowCount: true,
        executionTime: true,
        savedToDash: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    })

    const total = await prisma.query.count({
      where: { organizationId: req.user.organizationId },
    })

    res.json({ queries, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    console.error('GetQueryHistory error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Single Query ─────────────────────────────────────────────────────────
const getQuery = async (req, res) => {
  try {
    const { queryId } = req.params

    const query = await prisma.query.findFirst({
      where: { id: queryId, organizationId: req.user.organizationId },
      include: { user: { select: { name: true, email: true } } },
    })

    if (!query) {
      return res.status(404).json({ error: 'Query not found' })
    }

    res.json({ query })
  } catch (err) {
    console.error('GetQuery error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Save Query to Dashboard ──────────────────────────────────────────────────
const saveQueryToDashboard = async (req, res) => {
  try {
    const { queryId } = req.params

    const query = await prisma.query.findFirst({
      where: { id: queryId, organizationId: req.user.organizationId },
    })

    if (!query) {
      return res.status(404).json({ error: 'Query not found' })
    }

    await prisma.query.update({
      where: { id: queryId },
      data: { savedToDash: true },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Saved to dashboard',
        detail: query.question,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({ message: 'Query saved to dashboard' })
  } catch (err) {
    console.error('SaveQueryToDashboard error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Audit Logs ───────────────────────────────────────────────────────────
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query

    const logs = await prisma.auditLog.findMany({
      where: { organizationId: req.user.organizationId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    })

    const total = await prisma.auditLog.count({
      where: { organizationId: req.user.organizationId },
    })

    res.json({ logs, total })
  } catch (err) {
    console.error('GetAuditLogs error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  runQuery,
  getQueryHistory,
  getQuery,
  saveQueryToDashboard,
  getAuditLogs,
}