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
  getAllJobs(page = 1 ) {
    return api.get(`/admin/allJobs?page=${page}`)
  },
  approveJob(id) {
    return api.post(`/admin/approveJob/${id}`)
  },
  declineJob(id) {
    return api.post(`/admin/declineJob/${id}`)
  },
  getAllEmployers(page = 1) {
    return api.get(`/admin/get-all-employers?page=${page}`)
  },
  deleteEmployer(id) {
    return api.delete(`/admin/delete-employer/${id}`)
  },
  getAllUsers(page = 1) {
    return api.get(`/admin/get-all-users?page=${page}`)
  },
  deleteUser(id) {
    return api.delete(`/admin/delete-user/${id}`)
  }
}




