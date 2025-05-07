import axios from 'axios'

const API_URL = 'http://localhost:8000/api'  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

 
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default {
  login(credentials) {
    return api.post('/admin/login', credentials)
  },
  logout() {
    return api.post('/admin/logout')
  },
  getAllJobs() {
    return api.get('/admin/allJobs')
  },
  approveJob(id) {
    return api.post(`/admin/approveJob/${id}`)
  },
  declineJob(id) {
    return api.post(`/admin/declineJob/${id}`)
  }
}
