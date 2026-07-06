import api from './api'

export const getConnections = async () => {
  const res = await api.get('/databases')
  return res.data
}

export const testConnection = async (data) => {
  const res = await api.post('/databases/test', data)
  return res.data
}

export const createConnection = async (data) => {
  const res = await api.post('/databases', data)
  return res.data
}

export const deleteConnection = async (connectionId) => {
  const res = await api.delete(`/databases/${connectionId}`)
  return res.data
}

export const getConnectionSchema = async (connectionId) => {
  const res = await api.get(`/databases/${connectionId}/schema`)
  return res.data
}