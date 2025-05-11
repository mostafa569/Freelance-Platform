<template>
  <div class="register-container">
    <div class="row g-0">
      <div class="col-lg-6 d-flex align-items-center py-4">
        <div class="container px-4 px-lg-5">
          <div class="card shadow-none border-0">
            <div class="card-header bg-transparent border-0 text-center pt-3 pb-1">
              <div class="brand-logo mb-2">
                <i class="bi bi-building fs-1 text-primary"></i>
              </div>
              <h2 class="text-dark mb-1">Register as Employer</h2>
              <p class="text-muted small">Create your company account</p>
            </div>
            
            <div class="card-body px-0 px-sm-4 pt-2 pb-3">
              <div v-if="message" class="alert alert-danger d-flex align-items-center mb-3 py-2" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div class="small">{{ message }}</div>
              </div>
              
              <form @submit.prevent="handleRegister" novalidate>
                <!-- Company Name -->
                <div class="mb-2">
                  <label for="name" class="form-label small">
                    <i class="bi bi-building me-1 text-primary"></i> Company Name
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-building text-muted"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control py-1"
                      :class="{ 'is-invalid': submitted && errors.name }"
                      id="name"
                      v-model.trim="employer.name"
                      @input="clearError('name')"
                      placeholder="Enter company name"
                    >
                  </div>
                  <div v-if="submitted && errors.name" class="invalid-feedback d-block small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.name[0] }}
                  </div>
                </div>
                
                <!-- Email -->
                <div class="mb-2">
                  <label for="email" class="form-label small">
                    <i class="bi bi-envelope-fill me-1 text-primary"></i> Email
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control py-1"
                      :class="{ 'is-invalid': submitted && errors.email }"
                      id="email"
                      v-model.trim="employer.email"
                      @input="clearError('email')"
                      placeholder="Enter company email"
                    >
                  </div>
                  <div v-if="submitted && errors.email" class="invalid-feedback d-block small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.email[0] }}
                  </div>
                </div>
                
                <!-- Phone -->
                <div class="mb-2">
                  <label for="phone" class="form-label small">
                    <i class="bi bi-telephone-fill me-1 text-primary"></i> Phone Number
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-telephone text-muted"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control py-1"
                      :class="{ 'is-invalid': submitted && errors.phone }"
                      id="phone"
                      v-model.trim="employer.phone"
                      @input="clearError('phone')"
                      placeholder="Enter phone number"
                    >
                  </div>
                  <div v-if="submitted && errors.phone" class="invalid-feedback d-block small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.phone[0] }}
                  </div>
                </div>
                
                <!-- Website -->
                <div class="mb-2">
                  <label for="website" class="form-label small">
                    <i class="bi bi-globe me-1 text-primary"></i> Website (optional)
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-globe text-muted"></i>
                    </span>
                    <input
                      type="url"
                      class="form-control py-1"
                      :class="{ 'is-invalid': submitted && errors.website }"
                      id="website"
                      v-model.trim="employer.website"
                      @input="clearError('website')"
                      placeholder="Enter company website"
                    >
                  </div>
                  <div v-if="submitted && errors.website" class="invalid-feedback d-block small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.website[0] }}
                  </div>
                </div>
                
                <!-- Password -->
                <div class="mb-2">
                  <label for="password" class="form-label small">
                    <i class="bi bi-key-fill me-1 text-primary"></i> Password
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control py-1"
                      :class="{ 'is-invalid': submitted && errors.password }"
                      id="password"
                      v-model.trim="employer.password"
                      @input="clearError('password')"
                      placeholder="Create password"
                    >
                    <button class="btn btn-outline-secondary py-1" type="button" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="submitted && errors.password" class="invalid-feedback d-block small">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.password[0] }}
                  </div>
                </div>
                
                <!-- Confirm Password -->
                <div class="mb-3">
                  <label for="password_confirmation" class="form-label small">
                    <i class="bi bi-key-fill me-1 text-primary"></i> Confirm Password
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light py-1">
                      <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control py-1"
                      id="password_confirmation"
                      v-model.trim="employer.password_confirmation"
                      placeholder="Confirm password"
                    >
                  </div>
                </div>
                
                <!-- Submit Button -->
                <div class="d-grid mb-2">
                  <button
                    type="submit"
                    class="btn btn-primary py-2"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Registering...' : 'Register' }}
                  </button>
                </div>
                
                <!-- Login Link -->
                <div class="mt-2 text-center small">
                  Already have an account?
                  <router-link to="/login" class="text-decoration-none">Login</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6 d-none d-lg-block">
        <div class="h-100 bg-cover" style="height: 100vh; min-height: 600px;" 
             :style="{ backgroundImage: 'url(https://cdni.iconscout.com/illustration/premium/thumb/admin-login-illustration-download-in-svg-png-gif-file-formats--analytics-logo-action-people-illustrations-4297423.png)' }">
          <div class="h-100 d-flex align-items-center justify-content-center text-white">
            <div class="text-center p-5">
               
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'EmployerRegister',
  setup() {
    const router = useRouter()
    const store = useStore()
    const employer = ref({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      website: "",
    })
    const loading = ref(false)
    const errors = ref({})
    const message = ref('')
    const submitted = ref(false)
    const showPassword = ref(false)

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const clearError = (field) => {
      errors.value[field] = ''
      message.value = ''
    }

    const handleRegister = async () => {
      message.value = ""
      submitted.value = true
      errors.value = {}

      loading.value = true;

      try {
        await store.dispatch("auth/register", employer.value)
        router.push("/login");
      } catch (error) {
        loading.value = false;
        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            errors.value = error.response.data.errors;
          } else {
            message.value =
              error.response.data.message ||
              "An error occurred during registration";
          }
        } else {
          message.value = "A server connection error occurred";
        }
      }
    }

    return {
      employer,
      loading,
      errors,
      message,
      submitted,
      showPassword,
      handleRegister,
      togglePasswordVisibility,
      clearError
    }
  }
}
</script>

<style scoped>
.register-container {
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
  background-color: #f8f9fc !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.8em;
  margin-top: 0.2rem;
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 991.98px) {
  .register-container {
    padding: 1rem;
  }
  
  .col-lg-6.d-flex {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
  
  .card {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .card-header {
    padding-top: 0.5rem !important;
  }
  
  .card-body {
    padding: 0.5rem !important;
  }
  
  .form-control, .btn {
    font-size: 0.85rem;
  }
}
</style>
