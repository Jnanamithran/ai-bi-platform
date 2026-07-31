const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

let prisma

if (process.env.DATABASE_URL) {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
} else {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

module.exports = prisma