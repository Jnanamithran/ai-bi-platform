import api from './api'

export const getOrganization = async () => {
  const res = await api.get('/organization')
  return res.data
}

export const updateOrganization = async (data) => {
  const res = await api.patch('/organization', data)
  return res.data
}

export const getMembers = async () => {
  const res = await api.get('/organization/members')
  return res.data
}

export const inviteMember = async (data) => {
  const res = await api.post('/organization/members', data)
  return res.data
}

export const removeMember = async (userId) => {
  const res = await api.delete(`/organization/members/${userId}`)
  return res.data
}

export const updateMemberRole = async (userId, role) => {
  const res = await api.patch(`/organization/members/${userId}/role`, { role })
  return res.data
}

export const getRoles = async () => {
  const res = await api.get('/organization/roles')
  return res.data
}

export const createRole = async (data) => {
  const res = await api.post('/organization/roles', data)
  return res.data
}

export const updateRole = async (roleId, data) => {
  const res = await api.patch(`/organization/roles/${roleId}`, data)
  return res.data
}

export const deleteRole = async (roleId) => {
  const res = await api.delete(`/organization/roles/${roleId}`)
  return res.data
}