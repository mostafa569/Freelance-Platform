<template>
  <div class="register-page">
    <div class="form-container">
      <div class="form-box">
        <div class="text-center mb-4">
          <i class="fas fa-user-plus logo-icon"></i>
          <h2 class="title">Candidate Registration</h2>
          <p class="subtitle">Join the portal to find your dream job</p>
        </div>

        <form @submit.prevent="register">
          <div class="mb-4 input-icon-wrapper">
            <i class="fas fa-user icon"></i>
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
            <i class="fas fa-envelope icon"></i>
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
            <i class="fas fa-lock icon"></i>
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
            <i class="fas fa-lock icon"></i>
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

          <div class="mb-4">
            <select
              v-model="form.role"
              class="form-select"
              id="role"
              required
              :class="{ 'is-invalid': errors.role }"
            >
              <option value="candidate">Candidate</option>
            </select>
            <div v-if="errors.role" class="invalid-feedback">{{ errors.role }}</div>
          </div>

          <div v-if="form.role === 'candidate'" class="mb-4 input-icon-wrapper">
            <i class="fas fa-phone-alt icon"></i>
            <input
              v-model="form.phone"
              type="text"
              class="form-control input-with-icon"
              placeholder="Enter your phone number"
              :class="{ 'is-invalid': errors.phone }"
            />
            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
          </div>

          <button type="submit" class="btn btn-register w-100">Register</button>
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
  font-size: 30px;
  color: #0A64E6;
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
}

.btn-register:hover {
  background-color: #0846b3;
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
</style>
