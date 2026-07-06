import api from './api'

export const runQuery = async (data) => {
  const res = await api.post('/queries/run', data)
  return res.data
}

export const getQueryHistory = async (page = 1, limit = 20) => {
  const res = await api.get(`/queries/history?page=${page}&limit=${limit}`)
  return res.data
}

export const getQuery = async (queryId) => {
  const res = await api.get(`/queries/${queryId}`)
  return res.data
}

export const saveQueryToDashboard = async (queryId) => {
  const res = await api.patch(`/queries/${queryId}/save`)
  return res.data
}

export const getAuditLogs = async (page = 1, limit = 50) => {
  const res = await api.get(`/queries/audit?page=${page}&limit=${limit}`)
  return res.data
}