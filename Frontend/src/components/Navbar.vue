<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand" href="#">Admin Dashboard</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/jobs">Jobs</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <span class="navbar-text me-3">
            Welcome, {{ adminName }}
          </span>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import api from '../services/api'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    
    const logout = async () => {
      try {
        await api.logout()
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_name')
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    
    return { logout }
  },
  computed: {
    adminName() {
      return localStorage.getItem('admin_name') || 'Admin'
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  
  background: linear-gradient(135deg, #0d9488 0%, #047857 100%);  
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
  transition: color 0.2s ease-in-out;
}

.navbar-brand:hover {
  color: #e2e8f0;  
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff !important;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);  
  border-radius: 5px;
  color: #e2e8f0 !important; 
}

.btn-outline-light {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 5px;
  border: 1px solid #ffffff;
  color: #ffffff;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-outline-light:hover {
  background-color: #0d9488;
  color: #ffffff;
  border-color: #0d9488;
}
</style>

