import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PERMISSIONS = [
  { id: 'run_queries', label: 'Run Queries', desc: 'Can ask questions and run SQL' },
  { id: 'view_dashboard', label: 'View Dashboard', desc: 'Can view saved dashboards' },
  { id: 'save_dashboard', label: 'Save to Dashboard', desc: 'Can pin query results' },
  { id: 'export_data', label: 'Export Data', desc: 'Can export results as CSV' },
  { id: 'manage_connections', label: 'Manage Connections', desc: 'Can add or remove databases' },
  { id: 'invite_members', label: 'Invite Members', desc: 'Can invite new team members' },
  { id: 'manage_roles', label: 'Manage Roles', desc: 'Can create and edit roles' },
  { id: 'billing', label: 'Billing', desc: 'Can manage subscription and billing' },
]

const DEFAULT_ROLES = [
  { id: 1, name: 'Owner', desc: 'Full access to everything', system: true, permissions: PERMISSIONS.map(p => p.id) },
  { id: 2, name: 'Admin', desc: 'Can manage workspace but not billing', system: true, permissions: ['run_queries', 'view_dashboard', 'save_dashboard', 'export_data', 'manage_connections', 'invite_members', 'manage_roles'] },
  { id: 3, name: 'Analyst', desc: 'Can run queries and save results', system: true, permissions: ['run_queries', 'view_dashboard', 'save_dashboard', 'export_data'] },
  { id: 4, name: 'Viewer', desc: 'Read-only access to dashboards', system: true, permissions: ['view_dashboard'] },
]

const DEFAULT_MEMBERS = [
  { id: 1, name: 'Jnanamithran', email: 'jnanamithranm@gmail.com', role: 'Owner' },
  { id: 2, name: 'John Doe', email: 'john@acme.com', role: 'Analyst' },
]

function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm hover:border-zinc-600 transition-colors"
      >
        <span>{value}</span>
        <span className="text-zinc-600 text-xs ml-2">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                {value === opt && <span className="mr-2 text-xs">✓</span>}
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Section({ title, desc, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="border border-zinc-900 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-zinc-900">
        <h2 className="text-sm font-medium text-white">{title}</h2>
        {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </motion.div>
  )
}

function Field({ label, value, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
      />
    </div>
  )
}

function Toggle({ label, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-300">{label}</p>
        {desc && <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${on ? 'bg-white' : 'bg-zinc-800'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${on ? 'left-5 bg-black' : 'left-0.5 bg-zinc-500'}`} />
      </button>
    </div>
  )
}

function RoleModal({ role, onClose, onSave }) {
  const [name, setName] = useState(role?.name || '')
  const [desc, setDesc] = useState(role?.desc || '')
  const [permissions, setPermissions] = useState(role?.permissions || [])

  function togglePermission(id) {
    setPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">{role ? 'Edit Role' : 'Create New Role'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">✕</button>
        </div>
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Role Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Data Lead, Finance Viewer..." className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What can this role do?" className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-3">Permissions</label>
            <div className="space-y-2">
              {PERMISSIONS.map(({ id, label, desc }) => (
                <div
                  key={id}
                  onClick={() => togglePermission(id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${permissions.includes(id) ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div>
                    <p className="text-sm text-zinc-300">{label}</p>
                    <p className="text-xs text-zinc-600">{desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${permissions.includes(id) ? 'bg-white border-white' : 'border-zinc-700'}`}>
                    {permissions.includes(id) && <span className="text-black text-xs leading-none">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave({ name, desc, permissions })} disabled={!name.trim()} className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {role ? 'Save Changes' : 'Create Role'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [roles, setRoles] = useState(DEFAULT_ROLES)
  const [members, setMembers] = useState(DEFAULT_MEMBERS)
  const [roleModal, setRoleModal] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Analyst')
  const [dbType, setDbType] = useState('PostgreSQL')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'organization', label: 'Organization' },
    { id: 'database', label: 'Database' },
    { id: 'team', label: 'Team' },
    { id: 'roles', label: 'Roles' },
    { id: 'notifications', label: 'Notifications' },
  ]

  function handleSaveRole(data) {
    if (roleModal === 'new') {
      setRoles(prev => [...prev, { id: Date.now(), ...data, system: false }])
    } else {
      setRoles(prev => prev.map(r => r.id === roleModal.id ? { ...r, ...data } : r))
    }
    setRoleModal(null)
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account and workspace.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-8">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-900 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">

        {activeTab === 'profile' && (
          <>
            <Section title="Personal Information" desc="Update your name and email." delay={0.1}>
              <Field label="Full Name" value="Jnanamithran" />
              <Field label="Email" value="jnanamithranm@gmail.com" type="email" />
              <button className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">Save Changes</button>
            </Section>
            <Section title="Change Password" delay={0.2}>
              <Field label="Current Password" type="password" placeholder="••••••••" />
              <Field label="New Password" type="password" placeholder="••••••••" />
              <Field label="Confirm New Password" type="password" placeholder="••••••••" />
              <button className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">Update Password</button>
            </Section>
            <Section title="Danger Zone" delay={0.3}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-300">Delete Account</p>
                  <p className="text-xs text-zinc-600 mt-0.5">This action cannot be undone.</p>
                </div>
                <button className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-4 py-2 rounded-lg transition-colors">Delete</button>
              </div>
            </Section>
          </>
        )}

        {activeTab === 'organization' && (
          <>
            <Section title="Organization Details" delay={0.1}>
              <Field label="Organization Name" value="Acme Corp" />
              <Field label="Organization Slug" value="acme-corp" />
              <Field label="Website" placeholder="https://acme.com" />
              <button className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">Save Changes</button>
            </Section>
            <Section title="Plan" desc="Your current subscription." delay={0.2}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">Free Plan</p>
                  <p className="text-xs text-zinc-500 mt-0.5">50 queries/month · 1 database · 2 members</p>
                </div>
                <button className="text-xs bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">Upgrade</button>
              </div>
            </Section>
          </>
        )}

        {activeTab === 'database' && (
          <>
            <Section title="Connected Databases" delay={0.1}>
              <div className="border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-300 font-mono">production-db</p>
                  <p className="text-xs text-zinc-600 mt-0.5">PostgreSQL · Connected</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </div>
              </div>
              <button
                onClick={() => navigate('/connect')}
                className="w-full text-sm text-zinc-500 hover:text-white border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-3 transition-colors text-center"
              >
                + Connect new database
              </button>
            </Section>
          </>
        )}

        {activeTab === 'team' && (
          <>
            <Section title="Team Members" delay={0.1}>
              <div className="space-y-3">
                {members.map(({ id, name, email, role }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-300">{name}</p>
                        <p className="text-xs text-zinc-600">{email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 border border-zinc-800 px-2 py-1 rounded-md">{role}</span>
                      {role !== 'Owner' && (
                        <button onClick={() => setMembers(prev => prev.filter(m => m.id !== id))} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Invite Member" delay={0.2}>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Role</label>
                <Dropdown options={roles.map(r => r.name)} value={inviteRole} onChange={setInviteRole} />
              </div>
              <button
                onClick={() => {
                  if (!inviteEmail.trim()) return
                  setMembers(prev => [...prev, { id: Date.now(), name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole }])
                  setInviteEmail('')
                }}
                className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Send Invite
              </button>
            </Section>
          </>
        )}

        {activeTab === 'roles' && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex items-center justify-between mb-2">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">All Roles</p>
              <button onClick={() => setRoleModal('new')} className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors">
                + New Role
              </button>
            </motion.div>
            <div className="space-y-3">
              {roles.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="border border-zinc-900 rounded-2xl px-5 py-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white font-medium">{role.name}</p>
                        {role.system && <span className="text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">system</span>}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{role.desc}</p>
                    </div>
                    {!role.system && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setRoleModal(role)} className="text-xs text-zinc-500 hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setRoles(prev => prev.filter(r => r.id !== role.id))} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSIONS.filter(p => role.permissions.includes(p.id)).map(p => (
                      <span key={p.id} className="text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-md">{p.label}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <Section title="Notification Preferences" delay={0.1}>
            <Toggle label="Query completed" desc="Get notified when a long query finishes." defaultOn={true} />
            <Toggle label="Weekly summary" desc="Receive a weekly digest of your activity." defaultOn={true} />
            <Toggle label="Team activity" desc="Get notified when a team member runs a query." />
            <Toggle label="Product updates" desc="Hear about new features and improvements." defaultOn={true} />
            <Toggle label="Security alerts" desc="Get notified about login attempts." defaultOn={true} />
            <button className="bg-white text-black text-xs font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">Save Preferences</button>
          </Section>
        )}

      </div>

      <AnimatePresence>
        {roleModal && (
          <RoleModal
            role={roleModal === 'new' ? null : roleModal}
            onClose={() => setRoleModal(null)}
            onSave={handleSaveRole}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default Settings