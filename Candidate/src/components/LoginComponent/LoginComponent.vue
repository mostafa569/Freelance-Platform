<template>
  <div class="login-page">
    <div class="form-container">
      <div class="form-box">
        <div class="text-center mb-4">
          <i class="bi bi-shield-lock-fill logo-icon"></i>
          <h2 class="title">Candidate Portal</h2>
          <p class="subtitle">Secure access for candidates</p>
        </div>

        <form @submit.prevent="login">
          <div class="mb-4 input-icon-wrapper">
            <i class="bi bi-envelope icon"></i>
            <input
              v-model="form.email"
              type="email"
              class="form-control input-with-icon"
              placeholder="Enter your email"
              :class="{ 'is-invalid': errors.email }"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          </div>

          <div class="mb-4 input-icon-wrapper">
            <i class="bi bi-lock icon"></i>
            <input
              v-model="form.password"
              type="password"
              class="form-control input-with-icon"
              placeholder="Enter your password"
              :class="{ 'is-invalid': errors.password }"
              required
            />
            <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
          </div>

          <button type="submit" class="btn btn-login w-100">
            <i class="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
          
          <div class="text-center mt-3">
            <p class="mb-0">
              Don't have an account? 
              <router-link to="/register" class="register-link">
                <i class="bi bi-person-plus-fill me-1"></i>Register now
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>

    <div class="image-container">
      <img
        src="@/assets/images/login-illustration.svg"
        alt="Login Illustration"
        class="login-illustration"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {},
    };
  },
  methods: {
    async login() {
      this.errors = {};

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address.';
      }

      if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters.';
      }

      if (Object.keys(this.errors).length === 0) {
        try {
          const response = await axios.post('http://localhost:8000/api/login', this.form);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.$router.push('/jobs');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.errors.email = 'Invalid credentials';
            this.errors.password = 'Invalid credentials';
          } else {
            alert('Login failed');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  background-color: #f8f9fc;
}

.form-container {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-box {
  background-color: #fff;
  padding: 50px;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.logo-icon {
  font-size: 40px;
  color: #0A64E6;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
  margin-top: 10px;
  color: #0A64E6;
}

.subtitle {
  color: #6c757d;
  font-size: 14px;
  margin-top: 5px;
}

.input-icon-wrapper {
  position: relative;
}

.input-icon-wrapper .icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 16px;
}

.input-with-icon {
  padding-left: 38px;
}

.btn-login {
  background-color: #0A64E6;
  border: none;
  color: #fff;
  margin-top: 10px;
  padding: 10px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #0846b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 100, 230, 0.3);
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  font-size: 12px;
  color: red;
  margin-top: 5px;
}

.image-container {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eef2fb;
}

.login-illustration {
  max-width: 90%;
  height: auto;
}

.register-link {
  color: #0A64E6;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #0846b3;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  
  .form-container, .image-container {
    width: 100%;
  }
  
  .form-container {
    order: 2;
    padding: 20px;
  }
  
  .image-container {
    order: 1;
    height: 30vh;
  }
  
  .form-box {
    padding: 30px;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
