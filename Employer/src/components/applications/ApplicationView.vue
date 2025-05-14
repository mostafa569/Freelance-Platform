<template>
  <div class="application-view-container">
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
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Application not found
      </div>
      <router-link to="/applications" class="btn btn-outline-primary">
        <i class="bi bi-arrow-left me-1"></i> Back to Applications
      </router-link>
    </div>

    <div v-else class="application-details">
      <div class="header-section">
        <h1 class="page-title">Application Details</h1>
        <div class="header-actions">
          <button @click="goBack" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Back to Applications
          </button>
        </div>
      </div>

      <div class="application-card">
        <!-- Application Status Header -->
        <div class="application-status-header" :class="getStatusBgClass(application.status)">
          <div class="status-badge">
            <span class="badge" :class="getStatusBadgeClass(application.status)">
              {{ getStatusLabel(application.status) }}
            </span>
          </div>
          <div class="application-id">Application #{{ application.application_id }}</div>
          <div class="applied-date">
            <i class="bi bi-calendar"></i>
            Applied on {{ formatDate(application.applied_at) }}
          </div>
        </div>

        <div class="application-content">
          <!-- Candidate Information -->
          <div class="section">
            <h3 class="section-title">
              <i class="bi bi-person-circle"></i>
              Candidate Information
            </h3>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-person"></i>
                  <div>
                    <h6>Full Name</h6>
                    <p>{{ application.candidate_name }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-envelope"></i>
                  <div>
                    <h6>Email</h6>
                    <p>
                      <a :href="`mailto:${application.candidate_email}`">
                        {{ application.candidate_email }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-telephone"></i>
                  <div>
                    <h6>Phone</h6>
                    <p>
                      <a :href="`tel:${application.candidate_phone}`">
                        {{ application.candidate_phone }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-person-badge"></i>
                  <div>
                    <h6>Candidate ID</h6>
                    <p>{{ application.candidate_id }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Job Information -->
          <div class="section">
            <h3 class="section-title">
              <i class="bi bi-briefcase"></i>
              Job Information
            </h3>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-card-heading"></i>
                  <div>
                    <h6>Job Title</h6>
                    <p>
                      <router-link :to="`/jobs/${application.job_id}`">
                        {{ application.job_title }}
                      </router-link>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-geo-alt"></i>
                  <div>
                    <h6>Location</h6>
                    <p>{{ application.location }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-laptop"></i>
                  <div>
                    <h6>Work Type</h6>
                    <p>{{ getWorkTypeLabel(application.work_type) }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-card">
                  <i class="bi bi-cash-stack"></i>
                  <div>
                    <h6>Salary Range</h6>
                    <p>${{ application.salary_min }} - ${{ application.salary_max }}</p>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="info-card">
                  <i class="bi bi-card-text"></i>
                  <div>
                    <h6>Job Description</h6>
                    <p>{{ application.description }}</p>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="info-card">
                  <i class="bi bi-gift"></i>
                  <div>
                    <h6>Benefits</h6>
                    <p>{{ application.benefits }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Application Actions -->
          <div class="section" v-if="application.status === 'pending'">
            <h3 class="section-title">
              <i class="bi bi-gear"></i>
              Application Actions
            </h3>
            <div class="action-buttons">
              <button 
                class="btn btn-success"
                @click="updateStatus('accepted')"
              >
                <i class="bi bi-check-circle"></i> Accept Application
              </button>
              <button 
                class="btn btn-danger"
                @click="updateStatus('rejected')"
              >
                <i class="bi bi-x-circle"></i> Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApplicationService from '@/services/application.service';

export default {
  name: "ApplicationView",
  props: {
    id: {
      type: [Number, String],
      required: false
    }
  },
  data() {
    return {
      application: {},
      loading: true,
      notFound: false,
      message: "",
      messageType: ""
    };
  },
  created() {
    this.fetchApplication();
  },
  methods: {
    fetchApplication() {
      const applicationId = this.id || this.$route.params.id;
      
      this.loading = true;
      ApplicationService.getApplication(applicationId)
        .then(response => {
          this.application = response.data.application || response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching application:', error);
          this.loading = false;
          if (error.response && error.response.status === 404) {
            this.notFound = true;
          } else {
            this.message = "Error loading application details";
            this.messageType = "error";
          }
        });
    },
    formatDate(dateString) {
      if (!dateString) return "Not specified";
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    getStatusLabel(status) {
      if (!status) return 'Unknown';
      const labels = {
        'pending': 'Pending Review',
        'accepted': 'Accepted',
        'rejected': 'Rejected'
      };
      return labels[status] || status;
    },
    getStatusBadgeClass(status) {
      if (!status) return 'bg-secondary';
      const classes = {
        'pending': 'bg-warning text-dark',
        'accepted': 'bg-success',
        'rejected': 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    },
    getStatusBgClass(status) {
      if (!status) return 'bg-secondary';
      const classes = {
        'pending': 'bg-warning-subtle',
        'accepted': 'bg-success-subtle',
        'rejected': 'bg-danger-subtle'
      };
      return classes[status] || 'bg-secondary-subtle';
    },
    getWorkTypeLabel(type) {
      if (!type) return 'Not specified';
      const labels = {
        'onsite': 'On-site',
        'remote': 'Remote',
        'hybrid': 'Hybrid'
      };
      return labels[type] || type;
    },
    updateStatus(status) {
      const applicationId = this.id || this.$route.params.id;
      
      if (!applicationId) return;
      
      this.loading = true;
      ApplicationService.updateApplicationStatus(applicationId, status)
        .then(response => {
          this.application.status = status;
          this.message = `Application ${status} successfully`;
          this.messageType = "success";
          this.loading = false;
        })
        .catch(error => {
          console.error('Error updating application status:', error);
          this.message = error.response?.data?.message || "Error updating application status";
          this.messageType = "error";
          this.loading = false;
        });
    },
    goBack() {
      this.$router.push('/applications');
    }
  }
};
</script>

<style scoped>
.application-view-container {
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #1e293b;
  font-weight: 800;
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(120deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.application-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.application-status-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.status-badge .badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.application-id {
  font-weight: 600;
  color: #334155;
}

.applied-date {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.application-content {
  padding: 2rem;
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

.info-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  height: 100%;
}

.info-card i {
  font-size: 1.25rem;
  color: #3b82f6;
  margin-top: 0.25rem;
}

.info-card h6 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.info-card p {
  font-size: 1rem;
  color: #334155;
  margin: 0;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);
}

.btn-success:hover {
  background: linear-gradient(135deg, #059669, #10b981);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-outline-secondary {
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

@media (max-width: 768px) {
  .application-view-container {
    padding: 1.5rem;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .application-status-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .application-content {
    padding: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>