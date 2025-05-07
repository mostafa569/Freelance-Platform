<template>
  <div class="login-container min-vh-100">
    <div class="row g-0 h-100">
      <div class="col-lg-6 d-flex align-items-center">
        <div class="container py-5 px-4 px-lg-5">
          <div class="card shadow-none border-0">
            <div class="card-header bg-transparent border-0 text-center pt-4">
              <div class="brand-logo mb-3">
                <i class="bi bi-shield-lock fs-1 text-primary"></i>
              </div>
              <h2 class="text-dark mb-1">Admin Portal</h2>
              <p class="text-muted">Secure access for administrators</p>
            </div>
            
            <div class="card-body px-0 px-sm-4 pt-2">
               
              <div v-if="serverError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ serverError }}</div>
              </div>
              
              <form @submit.prevent="handleLogin" novalidate>
                
                <div class="mb-3">
                  <label for="full_name" class="form-label">
                    <i class="bi bi-person-fill me-1 text-primary"></i> Full Name
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.full_name }"
                      id="full_name"
                      v-model.trim="credentials.full_name"
                      @input="clearError('full_name')"
                      autocomplete="username"
                      placeholder="Enter your full name"
                    >
                  </div>
                  <div v-if="errors.full_name" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.full_name }}
                  </div>
                </div>
                
              
                <div class="mb-4">
                  <label for="password" class="form-label">
                    <i class="bi bi-key-fill me-1 text-primary"></i> Password
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      id="password"
                      v-model.trim="credentials.password"
                      @input="clearError('password')"
                      autocomplete="current-password"
                      placeholder="Enter your password"
                    >
                    <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.password }}
                  </div>
                </div>
                
              
                
              
                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg py-2"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Authenticating...' : 'Login' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6 d-none d-lg-block">
        <div class="h-100 bg-cover" :style="{ backgroundImage: 'url(' + placeholderImage + ')' }">
          <div class="h-100 d-flex align-items-center justify-content-center text-white">
            <div class="text-center p-5"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const credentials = ref({
      full_name: '',
      password: ''
    })
    const loading = ref(false)
    const errors = ref({
      full_name: '',
      password: ''
    })
    const serverError = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const placeholderImage = ref('https://cdni.iconscout.com/illustration/premium/thumb/admin-login-illustration-download-in-svg-png-gif-file-formats--analytics-logo-action-people-illustrations-4297423.png')

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const clearError = (field) => {
      errors.value[field] = ''
      serverError.value = ''
    }

    const validateForm = () => {
      let isValid = true
      errors.value = { full_name: '', password: '' }
      
      if (!credentials.value.full_name.trim()) {
        errors.value.full_name = 'Please enter your full name'
        isValid = false
      }
      
      if (!credentials.value.password) {
        errors.value.password = 'Please enter your password'
        isValid = false
      } else if (credentials.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
        isValid = false
      }
      
      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) {
        loading.value = false
        return
      }

      loading.value = true
      serverError.value = ''
      
      try {
        const response = await api.login(credentials.value)
        const { access_token, admin_name } = response.data
        
        localStorage.setItem('admin_token', access_token)
        localStorage.setItem('admin_name', admin_name)
        
        router.push('/jobs')
      } catch (err) {
        serverError.value = err.response?.data?.message || 'Login failed. Please check your credentials or try again later.'
      } finally {
        loading.value = false
      }
    }


    return {
      credentials,
      loading,
      errors,
      serverError,
      showPassword,
      rememberMe,
      placeholderImage,
      handleLogin,
      togglePasswordVisibility,
      clearError
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #f8f9fa;
}

.bg-cover {
  background-size: cover;
  background-position: center;
}

.brand-logo {
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.1);
}

.btn-primary {
  background-color: #4e73df;
  border-color: #4e73df;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2e59d9;
  border-color: #2653d4;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
  background-color: #f8f9fc !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 991.98px) {
  .login-container {
    background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
                    url('https://cdni.iconscout.com/illustration/premium/thumb/admin-login-illustration-download-in-svg-png-gif-file-formats--analytics-logo-action-people-illustrations-4297423.png');
    background-size: cover;
    background-position: center;
  }
}
</style>