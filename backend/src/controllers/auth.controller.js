const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')
const { generateToken } = require('../utils/jwt')

// ─── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body

    // Validate fields
    if (!name || !email || !password || !organizationName) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    // Create org slug from name
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check slug uniqueness
    const existingOrg = await prisma.organization.findUnique({ where: { slug } })
    const finalSlug = existingOrg ? `${slug}-${Date.now()}` : slug

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create organization and owner user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: finalSlug,
        },
      })

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'OWNER',
          organizationId: organization.id,
        },
      })

      // Create default roles for the organization
      await tx.role.createMany({
        data: [
          {
            name: 'Owner',
            description: 'Full access to everything',
            permissions: ['run_queries', 'view_dashboard', 'save_dashboard', 'export_data', 'manage_connections', 'invite_members', 'manage_roles', 'billing'],
            organizationId: organization.id,
            isSystem: true,
          },
          {
            name: 'Admin',
            description: 'Can manage workspace but not billing',
            permissions: ['run_queries', 'view_dashboard', 'save_dashboard', 'export_data', 'manage_connections', 'invite_members', 'manage_roles'],
            organizationId: organization.id,
            isSystem: true,
          },
          {
            name: 'Analyst',
            description: 'Can run queries and save results',
            permissions: ['run_queries', 'view_dashboard', 'save_dashboard', 'export_data'],
            organizationId: organization.id,
            isSystem: true,
          },
          {
            name: 'Viewer',
            description: 'Read-only access to dashboards',
            permissions: ['view_dashboard'],
            organizationId: organization.id,
            isSystem: true,
          },
        ],
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: 'Registered',
          detail: `${name} created organization ${organizationName}`,
          userId: user.id,
          organizationId: organization.id,
        },
      })

      return { user, organization }
    })

    // Generate token
    const token = generateToken({
      userId: result.user.id,
      organizationId: result.organization.id,
      role: result.user.role,
    })

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
        plan: result.organization.plan,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'Logged in',
        detail: `${user.name} logged in`,
        userId: user.id,
        organizationId: user.organizationId,
      },
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
        plan: user.organization.plan,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Get Me ──────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      organization: {
        id: req.user.organization.id,
        name: req.user.organization.name,
        slug: req.user.organization.slug,
        plan: req.user.organization.plan,
      },
    })
  } catch (err) {
    console.error('GetMe error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// ─── Change Password ─────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const isValid = await bcrypt.compare(currentPassword, req.user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('ChangePassword error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { register, login, getMe, changePassword }