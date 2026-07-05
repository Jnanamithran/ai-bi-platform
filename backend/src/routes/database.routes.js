const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/auth.middleware')
const {
  getConnections,
  testDatabaseConnection,
  createConnection,
  deleteConnection,
  getConnectionSchema,
} = require('../controllers/database.controller')

router.use(protect)

router.get('/', getConnections)
router.post('/test', testDatabaseConnection)
router.post('/', restrictTo('OWNER', 'ADMIN'), createConnection)
router.delete('/:connectionId', restrictTo('OWNER', 'ADMIN'), deleteConnection)
router.get('/:connectionId/schema', getConnectionSchema)

module.exports = router