const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/auth.middleware')
const {
  getOrganization,
  updateOrganization,
  getMembers,
  inviteMember,
  removeMember,
  updateMemberRole,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/organization.controller')

// All routes are protected
router.use(protect)

// Organization
router.get('/', getOrganization)
router.patch('/', restrictTo('OWNER', 'ADMIN'), updateOrganization)

// Members
router.get('/members', getMembers)
router.post('/members', restrictTo('OWNER', 'ADMIN'), inviteMember)
router.delete('/members/:userId', restrictTo('OWNER', 'ADMIN'), removeMember)
router.patch('/members/:userId/role', restrictTo('OWNER'), updateMemberRole)

// Roles
router.get('/roles', getRoles)
router.post('/roles', restrictTo('OWNER', 'ADMIN'), createRole)
router.patch('/roles/:roleId', restrictTo('OWNER', 'ADMIN'), updateRole)
router.delete('/roles/:roleId', restrictTo('OWNER', 'ADMIN'), deleteRole)

module.exports = router