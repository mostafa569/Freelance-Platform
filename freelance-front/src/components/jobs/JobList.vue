<template>
  <div class="job-list-container">
    <!-- Success/Error Alerts -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        v-if="message && !isError"
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
        v-else-if="isError"
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
    <div v-else-if="jobs.length === 0" class="empty-state">
      <div class="text-center py-5">
        <h4 class="mb-3">No jobs registered yet</h4>
        <router-link to="/jobs/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Add First Job
        </router-link>
      </div>
    </div>

    <!-- Job List Content -->
    <div v-else class="content-container">
      <div class="header-section">
        <h1 class="page-title">Job List</h1>
        <router-link to="/jobs/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Add New Job
        </router-link>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-header">
              <tr>
                <th>TITLE</th>
                <th>LOCATION</th>
                <th>WORK TYPE</th>
                <th>APPROVAL STATUS</th>
                <th>APPLICATION DEADLINE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in jobs" :key="job.id" class="table-row">
                <td>
                  <span class="job-title">{{ job.title }}</span>
                </td>
                <td>{{ job.location }}</td>
                <td>
                  <span class="badge" :class="getWorkTypeBadgeClass(job.work_type)">
                    {{ getWorkTypeLabel(job.work_type) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(job.approval_status)">
                    {{ getStatusLabel(job.approval_status) }}
                  </span>
                </td>
                <td>{{ formatDate(job.application_deadline) }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <router-link
                      :to="`/jobs/${job.id}`"
                      class="btn btn-sm btn-info"
                      style="color: white;"
                    >
                      <i class="bi bi-eye"></i> View
                    </router-link>
                    <router-link
                      :to="`/jobs/${job.id}/edit`"
                      class="btn btn-sm btn-primary"
                      :class="{ disabled: job.approval_status === 'approved' }"
                    >
                      <i class="bi bi-pencil"></i> Edit
                    </router-link>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="confirmDelete(job)"
                    >
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
      ref="deleteModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="jobToDelete">
            Are you sure you want to delete the job "{{ jobToDelete.title }}"?
            This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteJob"
              :disabled="deleteLoading"
            >
              <span
                v-show="deleteLoading"
                class="spinner-border spinner-border-sm"
              ></span>
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  name: "JobList",
  data() {
    return {
      loading: false,
      deleteLoading: false,
      message: "",
      isError: false,
      errorMessage: "",
      jobToDelete: null,
      deleteModal: null,
    };
  },
  computed: {
    jobs() {
      return this.$store.getters["job/allJobs"];
    },
  },
  mounted() {
    this.fetchJobs();
    this.deleteModal = new Modal(this.$refs.deleteModal);
  },
  methods: {
    fetchJobs() {
      this.loading = true;
      this.$store
        .dispatch("job/fetchJobs")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.isError = true;
          this.errorMessage = "Error fetching jobs: " + error.message;
          console.error("Error fetching jobs:", error);
        });
    },
    confirmDelete(job) {
      this.jobToDelete = job;
      this.deleteModal.show();
    },
    deleteJob() {
      if (!this.jobToDelete) return;

      this.deleteLoading = true;
      this.$store
        .dispatch("job/deleteJob", this.jobToDelete.id)
        .then(() => {
          this.deleteLoading = false;
          this.deleteModal.hide();
          this.jobToDelete = null;
          this.message = "Job deleted successfully";
          setTimeout(() => {
            this.message = "";
          }, 5000);
        })
        .catch((error) => {
          this.deleteLoading = false;
          this.isError = true;
          this.errorMessage = "Error deleting job: " + error.message;
          console.error("Error deleting job:", error);
        });
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    getWorkTypeLabel(workType) {
      switch (workType) {
        case "remote":
          return "Remote";
        case "onsite":
          return "Onsite";
        case "hybrid":
          return "Hybrid";
        default:
          return workType;
      }
    },
    getWorkTypeBadgeClass(workType) {
      switch (workType) {
        case "remote":
          return "bg-info";
        case "onsite":
          return "bg-secondary";
        case "hybrid":
          return "bg-primary";
        default:
          return "bg-secondary";
      }
    },
    getStatusLabel(status) {
      switch (status) {
        case "pending":
          return "Pending Review";
        case "approved":
          return "Approved";
        case "rejected":
          return "Rejected";
        default:
          return status;
      }
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case "pending":
          return "bg-warning text-dark";
        case "approved":
          return "bg-success";
        case "rejected":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    },
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.job-list-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  min-height: calc(100vh - 1rem);
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
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

.job-title {
  font-weight: 500;
  color: #333;
}

.btn {
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-info {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border: none;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.2);
}

.btn-info:hover {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
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
  .job-list-container {
    padding: 1.5rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
