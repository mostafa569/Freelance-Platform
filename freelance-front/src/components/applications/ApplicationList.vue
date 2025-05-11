<template>
  <div class="applications-container">
    <!-- Success/Error Alerts -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        v-if="message"
        class="alert alert-success alert-dismissible fade show shadow-sm"
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
      <div
        v-if="errorMessage"
        class="alert alert-danger alert-dismissible fade show shadow-sm"
        role="alert"
      >
        {{ errorMessage }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="applications.length === 0" class="empty-state">
      <div class="text-center py-5">
        <h4 class="mb-3">No applications found</h4>
      </div>
    </div>

    <!-- Applications Content -->
    <div v-else class="content-container">
      <div class="header-section">
        <h1 class="page-title">Applications</h1>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-header">
              <tr>
                <th>APPLICANT NAME</th>
                <th>JOB TITLE</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applications" :key="app.id || app.application_id" class="table-row">
                <td>{{ app.applicant_name || app.candidate_name }}</td>
                <td>
                  <router-link :to="`/jobs/${app.job_id}`" class="job-link">
                    {{ app.job_title }}
                  </router-link>
                </td>
                <td>{{ formatDate(app.created_at || app.applied_at) }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(app.status)">
                    {{ formatStatus(app.status) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <router-link 
                      :to="`/applications/${app.id || app.application_id}`" 
                      class="btn btn-sm btn-info"
                    >
                      <i class="bi bi-eye"></i> View
                    </router-link>
                    <template v-if="app.status === 'pending'">
                      <button 
                        class="btn btn-sm btn-success" 
                        @click="updateStatus(app, 'accepted')" 
                        :disabled="app.processing"
                      >
                        <span v-if="app.processing" class="spinner-border spinner-border-sm me-1"></span>
                        <i class="bi bi-check-circle"></i> Accept
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        @click="updateStatus(app, 'rejected')" 
                        :disabled="app.processing"
                      >
                        <span v-if="app.processing" class="spinner-border spinner-border-sm me-1"></span>
                        <i class="bi bi-x-circle"></i> Reject
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApplicationService from '@/services/application.service';

export default {
  data() {
    return {
      applications: [],
      loading: false,
      message: '',
      errorMessage: ''
    };
  },
  created() {
    this.loadApplications();
  },
  methods: {
    loadApplications() {
      this.loading = true;
      ApplicationService.getApplications()
        .then(res => {
          let apps = Array.isArray(res.data) ? res.data : res.data.applications || [];
          this.applications = apps.map(app => ({
            ...app,
            id: app.id || app.application_id,
            job_title: app.job_title || (app.job?.title || 'Unknown'),
            job_id: app.job_id || (app.job?.id || null),
            applicant_name: app.candidate_name || app.applicant_name || 'Unknown',
            processing: false
          }));
          this.loading = false;
        })
        .catch(err => {
          console.error('Error loading applications', err);
          this.errorMessage = 'Failed to load applications';
          this.loading = false;
        });
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : "";
    },
    formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'accepted': return 'bg-success';
        case 'rejected': return 'bg-danger';
        case 'pending': return 'bg-warning text-dark';
        default: return 'bg-secondary';
      }
    },
    updateStatus(app, status) {
      if (!app.id) return;
      
      app.processing = true;
      
      ApplicationService.updateApplicationStatus(app.id, status)
        .then(() => {
          app.status = status;
          this.message = `Application ${status} successfully`;
          setTimeout(() => {
            this.message = '';
          }, 5000);
        })
        .catch(err => {
          console.error('Error updating status', err);
          this.errorMessage = `Failed to ${status} application`;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        })
        .finally(() => {
          app.processing = false;
        });
    }
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.applications-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  min-height: calc(100vh - 1rem);
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  margin-top: 70px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-section {
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
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

.table-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.table-responsive {
  flex: 1;
  overflow: auto;
}

.table {
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #ffffff;
}

.table-header {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
}

.table-header th {
  font-weight: 700;
  color: #475569;
  padding: 1.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  position: relative;
}

.table-header th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.table-header th:hover::after {
  transform: scaleX(1);
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.table-row td {
  padding: 1.5rem 1rem;
  vertical-align: middle;
  color: #334155;
  font-size: 0.95rem;
  position: relative;
}

.job-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.job-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.btn {
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-info {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border: none;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.2);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #10b981);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.2);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.badge {
  font-size: 0.75em;
  padding: 0.35em 0.7em;
  border-radius: 10px;
}

/* Custom scrollbar */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #8b5cf6, #3b82f6);
}

@media (max-width: 768px) {
  .applications-container {
    padding: 1.5rem;
    margin-top: 60px;
  }

  .header-section {
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
    padding-left: 1rem;
  }

  .table-header th,
  .table-row td {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }

  .btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
