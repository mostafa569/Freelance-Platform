<template>
  <div class="job-edit-container">
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

    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="notFound" class="error-container">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-circle"></i> Job not found
      </div>
      <router-link to="/jobs" class="btn btn-outline-primary">
        Back to Jobs
      </router-link>
    </div>

    <div v-else class="form-card">
      <div class="form-header">
        <h1 class="page-title">Edit Job</h1>
        <p class="page-subtitle">Update the details of this job posting</p>
      </div>

      <form @submit.prevent="submitForm">
        <!-- Job Title -->
        <div class="form-section">
          <label for="title" class="form-label">
            Job Title <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="job.title"
            :class="{ 'is-invalid': submitted && errors.title }"
            placeholder="e.g. Senior Frontend Developer"
          />
          <div v-if="submitted && errors.title" class="invalid-feedback">
            {{ errors.title[0] }}
          </div>
        </div>

        <!-- Job Description -->
        <div class="form-section">
          <label for="description" class="form-label">
            Job Description <span class="text-danger">*</span>
          </label>
          <textarea
            class="form-control"
            id="description"
            v-model="job.description"
            rows="5"
            :class="{ 'is-invalid': submitted && errors.description }"
            placeholder="Describe the job, company culture, and expectations"
          ></textarea>
          <div v-if="submitted && errors.description" class="invalid-feedback">
            {{ errors.description[0] }}
          </div>
        </div>

        <!-- Responsibilities -->
        <div class="form-section">
          <label for="responsibilities" class="form-label">
            Responsibilities <span class="text-danger">*</span>
          </label>
          <textarea
            class="form-control"
            id="responsibilities"
            v-model="job.responsibilities"
            rows="5"
            :class="{ 'is-invalid': submitted && errors.responsibilities }"
            placeholder="List key responsibilities and daily tasks"
          ></textarea>
          <div v-if="submitted && errors.responsibilities" class="invalid-feedback">
            {{ errors.responsibilities[0] }}
          </div>
        </div>

        <!-- Qualifications -->
        <div class="form-section">
          <label for="qualifications" class="form-label">
            Qualifications and Skills <span class="text-danger">*</span>
          </label>
          <textarea
            class="form-control"
            id="qualifications"
            v-model="job.qualifications"
            rows="5"
            :class="{ 'is-invalid': submitted && errors.qualifications }"
            placeholder="Required skills, education, and experience"
          ></textarea>
          <div v-if="submitted && errors.qualifications" class="invalid-feedback">
            {{ errors.qualifications[0] }}
          </div>
        </div>

        <!-- Salary Range -->
        <div class="row g-3">
          <div class="col-md-6">
            <div class="form-section">
              <label for="salary_min" class="form-label">
                Minimum Salary <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="number"
                  class="form-control"
                  id="salary_min"
                  v-model="job.salary_min"
                  :class="{ 'is-invalid': submitted && errors.salary_min }"
                  placeholder="e.g. 50000"
                />
              </div>
              <div v-if="submitted && errors.salary_min" class="invalid-feedback">
                {{ errors.salary_min[0] }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-section">
              <label for="salary_max" class="form-label">
                Maximum Salary <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="number"
                  class="form-control"
                  id="salary_max"
                  v-model="job.salary_max"
                  :class="{ 'is-invalid': submitted && errors.salary_max }"
                  placeholder="e.g. 80000"
                />
              </div>
              <div v-if="submitted && errors.salary_max" class="invalid-feedback">
                {{ errors.salary_max[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="form-section">
          <label for="benefits" class="form-label">
            Benefits (Optional)
          </label>
          <textarea
            class="form-control"
            id="benefits"
            v-model="job.benefits"
            rows="3"
            :class="{ 'is-invalid': submitted && errors.benefits }"
            placeholder="Health insurance, 401k, remote work options, etc."
          ></textarea>
          <div v-if="submitted && errors.benefits" class="invalid-feedback">
            {{ errors.benefits[0] }}
          </div>
        </div>

        <!-- Location & Work Type -->
        <div class="row g-3">
          <div class="col-md-6">
            <div class="form-section">
              <label for="location" class="form-label">
                Location <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="location"
                v-model="job.location"
                :class="{ 'is-invalid': submitted && errors.location }"
                placeholder="e.g. New York, NY or 'Remote'"
              />
              <div v-if="submitted && errors.location" class="invalid-feedback">
                {{ errors.location[0] }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-section">
              <label for="work_type" class="form-label">
                Work Type <span class="text-danger">*</span>
              </label>
              <select
                class="form-select"
                id="work_type"
                v-model="job.work_type"
                :class="{ 'is-invalid': submitted && errors.work_type }"
              >
                <option value="" disabled>Select work type</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <div v-if="submitted && errors.work_type" class="invalid-feedback">
                {{ errors.work_type[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline-secondary" @click="goBack">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import JobService from '@/services/job.service';

export default {
  name: "JobEdit",
  data() {
    return {
      job: {
        title: "",
        description: "",
        responsibilities: "",
        qualifications: "",
        salary_min: "",
        salary_max: "",
        benefits: "",
        location: "",
        work_type: "",
      },
      loading: true,
      submitting: false,
      submitted: false,
      message: "",
      messageType: "",
      errors: {},
      notFound: false
    };
  },
  created() {
    this.fetchJob();
  },
  methods: {
    fetchJob() {
      const jobId = this.$route.params.id;
      JobService.getJob(jobId)
        .then(res => {
          this.job = res.data.job;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.notFound = err.response?.status === 404;
          if (!this.notFound) {
            this.message = "Error loading job details";
            this.messageType = "error";
          }
        });
    },
    submitForm() {
      this.submitted = true;
      this.message = "";
      this.messageType = "";
      this.errors = {};
      
      const requiredFields = ['title', 'description', 'responsibilities', 
                             'qualifications', 'salary_min', 'salary_max', 
                             'location', 'work_type'];
      
      const hasError = requiredFields.some(field => !this.job[field]);
      if (hasError) return;

      this.submitting = true;

      this.$store.dispatch("job/updateJob", {
        id: this.$route.params.id,
        jobData: this.job
      })
        .then(res => {
          this.submitting = false;
          this.message = res.message || "Job updated successfully";
          this.messageType = "success";
          setTimeout(() => this.$router.push("/jobs"), 2000);
        })
        .catch(err => {
          this.submitting = false;
          if (err.response?.data?.errors) {
            this.errors = err.response.data.errors;
          } else {
            this.message = err.response?.data?.message || "An error occurred while updating the job";
            this.messageType = "error";
          }
        });
    },
    goBack() {
      this.$router.push("/jobs");
    }
  }
};
</script>

<style scoped>
.job-edit-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.form-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.form-header {
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

.form-section {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control, .form-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-control:focus, .form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

textarea.form-control {
  min-height: 120px;
}

.input-group-text {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-outline-secondary {
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
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

@media (max-width: 768px) {
  .job-edit-container {
    padding: 1.5rem;
  }
  
  .form-card {
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
  
  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>