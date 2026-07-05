const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')

// ─── Get Organization ─────────────────────────────────────────────────────────
const getOrganization = async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        },
        databases: {
          select: { id: true, name: true, type: true, isActive: true, lastSync: true },
        },
        _count: {
          select: { queries: true, dashboards: true },
        },
      },
    })

    res.json({ organization: org })
  } catch (err) {
    console.error('GetOrganization error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Update Organization ──────────────────────────────────────────────────────
const updateOrganization = async (req, res) => {
  try {
    const { name, website } = req.body

    const org = await prisma.organization.update({
      where: { id: req.user.organizationId },
      data: { name, website },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Updated organization',
        detail: `Organization details updated`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({ message: 'Organization updated', organization: org })
  } catch (err) {
    console.error('UpdateOrganization error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Members ──────────────────────────────────────────────────────────────
const getMembers = async (req, res) => {
  try {
    const members = await prisma.user.findMany({
      where: { organizationId: req.user.organizationId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })

    res.json({ members })
  } catch (err) {
    console.error('GetMembers error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Invite Member ────────────────────────────────────────────────────────────
const inviteMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ANALYST',
        organizationId: req.user.organizationId,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Invited member',
        detail: `${email} invited as ${role || 'ANALYST'}`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.status(201).json({ message: 'Member invited successfully', user })
  } catch (err) {
    console.error('InviteMember error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Remove Member ────────────────────────────────────────────────────────────
const removeMember = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.user.organizationId },
    })

    if (!user) {
      return res.status(404).json({ error: 'Member not found' })
    }

    if (user.role === 'OWNER') {
      return res.status(403).json({ error: 'Cannot remove the owner' })
    }

    await prisma.user.delete({ where: { id: userId } })

    await prisma.auditLog.create({
      data: {
        action: 'Removed member',
        detail: `${user.email} removed from organization`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({ message: 'Member removed successfully' })
  } catch (err) {
    console.error('RemoveMember error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Update Member Role ───────────────────────────────────────────────────────
const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    const validRoles = ['ADMIN', 'ANALYST', 'VIEWER']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: req.user.organizationId },
    })

    if (!user) {
      return res.status(404).json({ error: 'Member not found' })
    }

    if (user.role === 'OWNER') {
      return res.status(403).json({ error: 'Cannot change owner role' })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Updated member role',
        detail: `${user.email} role changed to ${role}`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.json({ message: 'Role updated successfully', user: updated })
  } catch (err) {
    console.error('UpdateMemberRole error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Roles ────────────────────────────────────────────────────────────────
const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { createdAt: 'asc' },
    })

    res.json({ roles })
  } catch (err) {
    console.error('GetRoles error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Create Role ──────────────────────────────────────────────────────────────
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' })
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: permissions || [],
        organizationId: req.user.organizationId,
        isSystem: false,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'Created role',
        detail: `Role "${name}" created`,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      },
    })

    res.status(201).json({ message: 'Role created successfully', role })
  } catch (err) {
    console.error('CreateRole error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Update Role ──────────────────────────────────────────────────────────────
const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params
    const { name, description, permissions } = req.body

    const role = await prisma.role.findFirst({
      where: { id: roleId, organizationId: req.user.organizationId },
    })

    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }

    if (role.isSystem) {
      return res.status(403).json({ error: 'Cannot edit system roles' })
    }

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: { name, description, permissions },
    })

    res.json({ message: 'Role updated successfully', role: updated })
  } catch (err) {
    console.error('UpdateRole error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Delete Role ──────────────────────────────────────────────────────────────
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params

    const role = await prisma.role.findFirst({
      where: { id: roleId, organizationId: req.user.organizationId },
    })

    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }

    if (role.isSystem) {
      return res.status(403).json({ error: 'Cannot delete system roles' })
    }

    await prisma.role.delete({ where: { id: roleId } })

    res.json({ message: 'Role deleted successfully' })
  } catch (err) {
    console.error('DeleteRole error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
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
}