import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
}

export const appointmentsAPI = {
  getAll: (params) => API.get('/appointments', { params }),
  getOne: (id) => API.get(`/appointments/${id}`),
  getStats: () => API.get('/appointments/stats'),
  update: (id, data) => API.patch(`/appointments/${id}`, data),
  delete: (id) => API.delete(`/appointments/${id}`),
}

export const callsAPI = {
  initiate: (phoneNumber, language = 'en') =>
    API.post('/calls/initiate', { phoneNumber, language }),
  getStatus: (callId) => API.get(`/calls/status/${callId}`),
  getTranscript: (callId) => API.get(`/calls/transcript/${callId}`),
  listAll: (limit = 20) => API.get(`/calls/list`, { params: { limit } }),
}

export const recordingsAPI = {
  getAll: () => API.get('/recordings'),
}

export default API
