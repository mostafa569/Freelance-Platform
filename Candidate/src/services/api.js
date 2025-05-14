import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = {
  login: (credentials) => axios.post(`${API_URL}/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/register`, userData),
  
  getJobs: () => axios.get(`${API_URL}/jobs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  applyJob: (jobId) => axios.post(`${API_URL}/apply-job/${jobId}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  getApplications: () => axios.get(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  deleteApplication: (id) => axios.delete(`${API_URL}/delete-application/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};

export default api;
