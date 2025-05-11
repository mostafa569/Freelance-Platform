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
              <h2 class="text-dark mb-1">Login As Employer</h2>
              <p class="text-muted">Secure access to your account</p>
            </div>

            <div class="card-body px-0 px-sm-4 pt-2">
              <div v-if="message" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ message }}</div>
              </div>

              <form @submit.prevent="handleLogin" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label">
                    <i class="bi bi-envelope-fill me-1 text-primary"></i> Email
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors.email }"
                      id="email"
                      v-model.trim="credentials.email"
                      @input="clearError('email')"
                      autocomplete="username"
                      placeholder="Enter your email"
                    >
                  </div>
                  <div v-if="submitted && errors.email" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.email[0] }}
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
                      :class="{ 'is-invalid': submitted && errors.password }"
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
                  <div v-if="submitted && errors.password" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ errors.password[0] }}
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

                <div class="mt-3 text-center">
                  Don't have an account?
                  <router-link to="/register">Create a new account</router-link>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();

    const credentials = ref({
      email: '',
      password: '',
    });
    const loading = ref(false);
    const submitted = ref(false);
    const message = ref('');
    const errors = ref({});
    const showPassword = ref(false);
    const placeholderImage = ref('https://cdni.iconscout.com/illustration/premium/thumb/admin-login-illustration-download-in-svg-png-gif-file-formats--analytics-logo-action-people-illustrations-4297423.png');

    const loggedIn = computed(() => store.state.auth.status.loggedIn);

    // Redirect if already logged in
    if (loggedIn.value) {
      router.push('/dashboard');
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const clearError = (field) => {
      if (errors.value[field]) {
        errors.value[field] = null;
      }
      message.value = '';
    };

    const handleLogin = async () => {
      submitted.value = true;
      message.value = '';
      errors.value = {};

      // Client-side validation
      if (!credentials.value.email || !credentials.value.password) {
        if (!credentials.value.email) {
          errors.value.email = ['Please enter your email'];
        }
        if (!credentials.value.password) {
          errors.value.password = ['Please enter your password'];
        }
        return;
      }

      loading.value = true;

      try {
        await store.dispatch('auth/login', credentials.value);
        router.push('/dashboard');
      } catch (error) {
        loading.value = false;
        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            errors.value = error.response.data.errors;
          } else if (error.response.data.message) {
            message.value = error.response.data.message;
          } else {
            message.value = 'An error occurred while logging in';
          }
        } else {
          message.value = 'A server connection error occurred';
        }
      }
    };

    return {
      credentials,
      loading,
      submitted,
      message,
      errors,
      showPassword,
      placeholderImage,
      loggedIn,
      handleLogin,
      togglePasswordVisibility,
      clearError,
    };
  },
};
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
    background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
      url('https://cdni.iconscout.com/illustration/premium/thumb/admin-login-illustration-download-in-svg-png-gif-file-formats--analytics-logo-action-people-illustrations-4297423.png');
    background-size: cover;
    background-position: center;
  }
}
</style>