const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const {
  runQuery,
  getQueryHistory,
  getQuery,
  saveQueryToDashboard,
  getAuditLogs,
} = require('../controllers/query.controller')

router.use(protect)

router.post('/run', runQuery)
router.get('/history', getQueryHistory)
router.get('/audit', getAuditLogs)
router.get('/:queryId', getQuery)
router.patch('/:queryId/save', saveQueryToDashboard)

module.exports = router