<template>
  <div class="profile-container">
    <!-- Success/Error Alerts -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        v-if="message"
        class="alert alert-dismissible fade show shadow-sm"
        :class="messageType === 'success' ? 'alert-success' : 'alert-danger'"
        role="alert"
      >
        {{ message }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        <h1 class="page-title">Company Profile</h1>
        <p class="page-subtitle">Update your company information and settings</p>
      </div>

      <form @submit.prevent="updateProfile">
        <!-- Basic Information Section -->
        <div class="section">
          <h3 class="section-title">
            <i class="bi bi-building"></i>
            Basic Information
          </h3>
          
          <div class="form-group">
            <label for="name" class="form-label">
              Company Name <span class="text-danger">*</span>
            </label>
            <input
              v-model="profile.name"
              type="text"
              class="form-control"
              id="name"
              name="name"
              placeholder="Enter your company name"
              :class="{ 'is-invalid': submitted && errors.name }"
            />
            <div v-if="submitted && errors.name" class="invalid-feedback">
              {{ errors.name[0] }}
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="email" class="form-label">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  v-model="profile.email"
                  type="email"
                  class="form-control"
                  id="email"
                  name="email"
                  placeholder="company@example.com"
                  :class="{ 'is-invalid': submitted && errors.email }"
                />
                <div v-if="submitted && errors.email" class="invalid-feedback">
                  {{ errors.email[0] }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="phone" class="form-label">
                  Phone Number <span class="text-danger">*</span>
                </label>
                <input
                  v-model="profile.phone"
                  type="text"
                  class="form-control"
                  id="phone"
                  name="phone"
                  placeholder="+1 (123) 456-7890"
                  :class="{ 'is-invalid': submitted && errors.phone }"
                />
                <div v-if="submitted && errors.phone" class="invalid-feedback">
                  {{ errors.phone[0] }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="website" class="form-label">
              Website (Optional)
            </label>
            <div class="input-group">
              <span class="input-group-text">https://</span>
              <input
                v-model="profile.website"
                type="text"
                class="form-control"
                id="website"
                name="website"
                placeholder="yourcompany.com"
                :class="{ 'is-invalid': submitted && errors.website }"
              />
            </div>
            <div v-if="submitted && errors.website" class="invalid-feedback">
              {{ errors.website[0] }}
            </div>
          </div>
        </div>

        <!-- Password Section -->
        <div class="section">
          <h3 class="section-title">
            <i class="bi bi-shield-lock"></i>
            Change Password
            <span class="text-muted small">(Leave blank to keep current password)</span>
          </h3>
          
          <div class="row g-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="password" class="form-label">New Password</label>
                <input
                  v-model="profile.password"
                  type="password"
                  class="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  :class="{ 'is-invalid': submitted && errors.password }"
                />
                <div v-if="submitted && errors.password" class="invalid-feedback">
                  {{ errors.password[0] }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="password_confirmation" class="form-label">Confirm Password</label>
                <input
                  v-model="profile.password_confirmation"
                  type="password"
                  class="form-control"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployerProfile",
  data() {
    return {
      profile: {
        name: "",
        email: "",
        phone: "",
        website: "",
        password: "",
        password_confirmation: "",
      },
      submitted: false,
      loading: false,
      message: "",
      messageType: "",
      errors: {},
    };
  },
  computed: {
    currentEmployer() {
      return this.$store.state.auth.employer;
    },
  },
  created() {
    this.fetchProfileData();
  },
  methods: {
    fetchProfileData() {
      this.loading = true;
      this.$store
        .dispatch("auth/getProfile")
        .then((employer) => {
          this.profile.name = employer.name;
          this.profile.email = employer.email;
          this.profile.phone = employer.phone;
          this.profile.website = employer.website;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          if (error.response && error.response.data) {
            this.message =
              error.response.data.message ||
              "An error occurred while fetching profile data";
            this.messageType = "error";
          } else {
            this.message = "Server connection error";
            this.messageType = "error";
          }
        });
    },
    updateProfile() {
      this.submitted = true;
      this.message = "";
      this.errors = {};

      if (!this.profile.name || !this.profile.email || !this.profile.phone) {
        return;
      }

      const profileData = {
        name: this.profile.name,
        email: this.profile.email,
        phone: this.profile.phone,
        website: this.profile.website,
      };

      if (this.profile.password) {
        profileData.password = this.profile.password;
        profileData.password_confirmation = this.profile.password_confirmation;
      }

      this.loading = true;

      this.$store
        .dispatch("auth/updateProfile", profileData)
        .then(() => {
          this.loading = false;
          this.message = "Profile updated successfully";
          this.messageType = "success";
          this.profile.password = "";
          this.profile.password_confirmation = "";
          this.submitted = false;
        })
        .catch((error) => {
          this.loading = false;
          if (error.response && error.response.data) {
            if (error.response.data.errors) {
              this.errors = error.response.data.errors;
            } else {
              this.message =
                error.response.data.message ||
                "An error occurred while updating profile";
              this.messageType = "error";
            }
          } else {
            this.message = "Server connection error";
            this.messageType = "error";
          }
        });
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.profile-header {
  margin-bottom: 2.5rem;
}

.page-title {
  color: #1e293b;
  font-weight: 800;
  font-size: 2.5rem;
  margin: 0;
  position: relative;
  padding-left: 1.5rem;
  background: linear-gradient(120deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 80%;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.page-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  margin-left: 1.5rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3b82f6;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-group-text {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.invalid-feedback {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc2626 !important;
}

.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15) !important;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
    padding-left: 1rem;
  }
  
  .page-subtitle {
    margin-left: 1rem;
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>