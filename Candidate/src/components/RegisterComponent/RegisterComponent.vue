<template>
  <div class="register-page">
    <div class="form-container">
      <div class="form-box">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus-fill logo-icon"></i>
          <h2 class="title">Candidate Registration</h2>
          <p class="subtitle">Join the portal to find your dream job</p>
        </div>

        <form @submit.prevent="register">
          <div class="mb-4 input-icon-wrapper">
            <i class="bi bi-person icon"></i>
            <input
              v-model="form.full_name"
              type="text"
              class="form-control input-with-icon"
              placeholder="Enter your full name"
              :class="{ 'is-invalid': errors.full_name }"
              required
            />
            <div v-if="errors.full_name" class="invalid-feedback">{{ errors.full_name }}</div>
          </div>

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

          <div class="mb-4 input-icon-wrapper">
            <i class="bi bi-lock-fill icon"></i>
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control input-with-icon"
              placeholder="Confirm your password"
              :class="{ 'is-invalid': errors.password_confirmation }"
              required
            />
            <div v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation }}</div>
          </div>

          <div class="mb-4 input-icon-wrapper">
            <i class="bi bi-telephone icon"></i>
            <input
              v-model="form.phone"
              type="tel"
              class="form-control input-with-icon"
              placeholder="Enter your phone number (optional)"
              :class="{ 'is-invalid': errors.phone }"
            />
            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
          </div>

          <button type="submit" class="btn btn-register w-100">
            <i class="bi bi-check2-circle me-2"></i>Register
          </button>
          
          <div class="text-center mt-3">
            <p class="mb-0">
              Already have an account? 
              <router-link to="/login" class="login-link">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login here
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>

    <div class="image-container">
      <img
        src="@/assets/images/login-illustration.svg"
        alt="Register Illustration"
        class="register-illustration"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        full_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
        phone: '',
      },
      errors: {},
    };
  },
  methods: {
    async register() {
      this.errors = {};

      const nameRegex = /^[A-Za-z\s]{3,}$/;
      const phoneRegex = /^01[0125][0-9]{8}$/;

      if (!nameRegex.test(this.form.full_name)) {
        this.errors.full_name = 'Full name must be at least 3 letters and only contain letters and spaces.';
      }

      if (!this.form.email.includes('@')) {
        this.errors.email = 'Email must be a valid email address.';
      }

      if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters.';
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = 'Passwords do not match.';
      }

      if (this.form.role === 'candidate' && this.form.phone && !phoneRegex.test(this.form.phone)) {
        this.errors.phone = 'Phone must be a valid Egyptian number (e.g., 010xxxxxxxx).';
      }

      if (Object.keys(this.errors).length === 0) {
        try {
          const response = await axios.post('http://localhost:8000/api/register', this.form);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.$router.push('/jobs');
        } catch (error) {
          if (error.response && error.response.data.errors) {
            this.errors = error.response.data.errors;
          } else {
            alert('Registration failed');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.register-page {
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

.btn-register {
  background-color: #0A64E6;
  border: none;
  color: #fff;
  margin-top: 10px;
  padding: 10px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-register:hover {
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

.register-illustration {
  max-width: 90%;
  height: auto;
}

.login-link {
  color: #0A64E6;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #0846b3;
  text-decoration: underline;
}
</style>
