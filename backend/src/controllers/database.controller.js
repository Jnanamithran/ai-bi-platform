const prisma = require('../config/prisma')
const { testConnection, getSchema } = require('../config/dbConnector')
const crypto = require('crypto')

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'inquira_default_encryption_key_32'
const ALGORITHM = 'aes-256-cbc'

// ─── Encrypt / Decrypt ────────────────────────────────────────────────────────
const encrypt = (text) => {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

const decrypt = (text) => {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
}

// ─── Get All Connections ──────────────────────────────────────────────────────
const getConnections = async (req, res) => {
  try {
    const connections = await prisma.databaseConnection.findMany({
      where: { organizationId: req.user.organizationId },
      select: {
        id: true,
        name: true,
        type: true,
        host: true,
        port: true,
        dbname: true,
        username: true,
        isActive: true,
        lastSync: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ connections })
  } catch (err) {
    console.error('GetConnections error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Test Connection ──────────────────────────────────────────────────────────
const testDatabaseConnection = async (req, res) => {
  try {
    const { type, host, port, dbname, username, password } = req.body

    if (!type || !host || !port || !dbname || !username || !password) {
      return res.status(400).json({ error: 'All connection fields are required' })
    }

    await testConnection({ type, host, port, dbname, username, password })

    res.json({ message: 'Connection successful' })
  } catch (err) {
    console.error('TestConnection error:', err)
    res.status(400).json({ error: `Connection failed: ${err.message}` })
  }
}

// ─── Create Connection ────────────────────────────────────────────────────────
const createConnection = async (req, res) => {
  try {
    const { name, type, host, port, dbname, username, password } = req.body

    if (!name || !type || !host || !port || !dbname || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Test connection first
    await testConnection({ type, host, port, dbname, username, password })

    // Encrypt password
    const encryptedPassword = encrypt(password)

    const connection = await prisma.databaseConnection.create({
      data: {
        name,
        type,
        host,
        port: parseInt(port),
        dbname,
        username,
        password: encryptedPassword,
        organizationId: req.user.organizationId,
        lastSync: new Date(),
      },
      select: {
        id: true,
        name: true,
        type: true,
        host: true,
        port: true,
        dbname: true,
        username: true,
        isActive: true,
        lastSync: true,
        createdAt: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Connected database',
        detail: `${name} (${type}) connected`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.status(201).json({ message: 'Database connected successfully', connection })
  } catch (err) {
    console.error('CreateConnection error:', err)
    res.status(400).json({ error: `Failed to connect: ${err.message}` })
  }
}

// ─── Delete Connection ────────────────────────────────────────────────────────
const deleteConnection = async (req, res) => {
  try {
    const { connectionId } = req.params

    const connection = await prisma.databaseConnection.findFirst({
      where: { id: connectionId, organizationId: req.user.organizationId },
    })

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    await prisma.databaseConnection.delete({ where: { id: connectionId } })

    await prisma.auditLog.create({
      data: {
        action: 'Removed database',
        detail: `${connection.name} disconnected`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({ message: 'Database removed successfully' })
  } catch (err) {
    console.error('DeleteConnection error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Schema ───────────────────────────────────────────────────────────────
const getConnectionSchema = async (req, res) => {
  try {
    const { connectionId } = req.params

    const connection = await prisma.databaseConnection.findFirst({
      where: { id: connectionId, organizationId: req.user.organizationId },
    })

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    const decryptedPassword = decrypt(connection.password)

    const schema = await getSchema({
      type: connection.type,
      host: connection.host,
      port: connection.port,
      dbname: connection.dbname,
      username: connection.username,
      password: decryptedPassword,
    })

    // Update last sync
    await prisma.databaseConnection.update({
      where: { id: connectionId },
      data: { lastSync: new Date() },
    })

    res.json({ schema })
  } catch (err) {
    console.error('GetSchema error:', err)
    res.status(500).json({ error: `Failed to get schema: ${err.message}` })
  }
}

module.exports = {
  getConnections,
  testDatabaseConnection,
  createConnection,
  deleteConnection,
  getConnectionSchema,
}