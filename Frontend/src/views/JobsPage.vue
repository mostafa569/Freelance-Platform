<template>
  <div class="container mt-4">
    <h2 style="text-align: center;">All Jobs</h2>
    <div v-if="message" class="alert" :class="messageType">{{ message }}</div>

    <div class="card shadow-sm">
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered align-middle">
            <thead class="table-dark">
              <tr>
                <th class="col-id">ID</th>
                <th class="col-title">Title</th>
                <th class="col-employer">Employer</th>
                <th class="col-description">Description</th>
                <th class="col-salary">Salary Range</th>
                <th class="col-location">Location</th>
                <th class="col-work-type">Work Type</th>
                <th class="col-status">Status</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="9" class="text-center py-4">Loading jobs...</td>
              </tr>
              <tr v-else-if="jobs.length === 0">
                <td colspan="9" class="text-center py-4">No jobs found</td>
              </tr>
              <tr v-for="job in jobs" :key="job.id">
                <td>{{ job.id }}</td>
                <td>{{ job.title }}</td>
                <td>
                  <div class="employer-info">
                  <div class="d-flex align-items-center mb-1">
                    <i class="bi bi-person me-1"></i>
                    <strong>{{ job.employer_name }}</strong>
                  </div>
                    <div v-if="job.employer_website" class="d-flex align-items-center mb-1">
                      <i class="bi bi-globe2 me-1"></i>
                      <a :href="'https://' + job.employer_website" target="_blank" class="text-primary text-truncate">{{
                        job.employer_website }}</a>
                    </div>
                    <div class="d-flex align-items-center mb-1">
                      <i class="bi bi-envelope me-1"></i>
                      <a :href="`mailto:${job.employer_email}`" class="text-primary text-truncate">{{
                        job.employer_email }}</a>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-telephone me-1"></i>
                      <a :href="`tel:${job.employer_phone}`" class="text-primary">{{ job.employer_phone }}</a>
                    </div>
                  </div>
                </td>
                <td>{{ truncateDescription(job.description) }}</td>
                <td>
                  {{ formatSalary(job.salary_min) }} - {{ formatSalary(job.salary_max) }}
                </td>
                <td>{{ job.location }}</td>
                <td>{{ formatWorkType(job.work_type) }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(job.approval_status)">
                    {{ formatStatus(job.approval_status) }}
                  </span>
                  <div v-if="job.approval_date" class="small text-muted">
                    {{ formatDate(job.approval_date) }}
                  </div>
                </td>
                <td>
                  <div v-if="job.approval_status === 'pending'" class="d-flex gap-2">
                    <button class="btn btn-sm btn-success" @click="approveJob(job.id)" :disabled="job.processing">
                      <span v-if="job.processing" class="spinner-border spinner-border-sm me-1"></span>
                      Approve
                    </button>
                    <button class="btn btn-sm btn-danger" @click="declineJob(job.id)" :disabled="job.processing">
                      <span v-if="job.processing" class="spinner-border spinner-border-sm me-1"></span>
                      Reject
                    </button>
                  </div>
                  <span v-else class="text-muted">No actions available</span>
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
import { ref, onMounted } from 'vue'
import api from '../services/api'

export default {
  name: 'JobsPage',
  setup() {
    const jobs = ref([])
    const loading = ref(true)
    const message = ref('')
    const messageType = ref('alert-info')

    const loadJobs = async () => {
      loading.value = true
      try {
        const response = await api.getAllJobs()
        jobs.value = response.data.map(job => ({
          ...job,
          processing: false
        }))
      } catch (error) {
        showMessage('Failed to load jobs: ' + error.message, 'alert-danger')
      } finally {
        loading.value = false
      }
    }

    const showMessage = (msg, type = 'alert-success') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }

    const approveJob = async (id) => {
      const job = jobs.value.find(j => j.id === id)
      if (job) job.processing = true
      
      try {
        await api.approveJob(id)
        showMessage('Job approved successfully')
        await loadJobs()
      } catch (error) {
        showMessage(error.response?.data?.message || 'Failed to approve job', 'alert-danger')
      } finally {
        if (job) job.processing = false
      }
    }

    const declineJob = async (id) => {
      const job = jobs.value.find(j => j.id === id)
      if (job) job.processing = true
      
      try {
        await api.declineJob(id)
        showMessage('Job rejected successfully')
        await loadJobs()
      } catch (error) {
        showMessage(error.response?.data?.message || 'Failed to reject job', 'alert-danger')
      } finally {
        if (job) job.processing = false
      }
    }

    const formatSalary = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }

    const truncateDescription = (text, length = 100) => {
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const formatWorkType = (type) => {
      const types = {
        'remote': 'Remote',
        'onsite': 'On-Site',
        'hybrid': 'Hybrid'
      }
      return types[type] || type
    }

    const formatStatus = (status) => {
      return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'approved': return 'bg-success'
        case 'rejected': return 'bg-danger'
        case 'pending': return 'bg-warning'
        default: return 'bg-secondary'
      }
    }

    onMounted(loadJobs)

    return {
      jobs,
      loading,
      message,
      messageType,
      approveJob,
      declineJob,
      formatSalary,
      truncateDescription,
      formatWorkType,
      formatStatus,
      formatDate,
      getStatusBadgeClass
    }
  }
}
</script>

<style scoped>
 
.container {
  max-width: 100%;
  padding: 0 15px;
}

.card {
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  min-width: 800px;
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table th,
.table td {
  padding: 8px 10px;
  vertical-align: middle;
  white-space: nowrap;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.col-id {
  width: 5%;
}
.col-title {
  width: 13%;
}
.col-employer {
  width: 16%;
}
.col-description {
  width: 9%;
  white-space: normal;
}
.col-salary {
  width: 11%;
}
.col-location {
  width: 9%;
}
.col-work-type {
  width: 7%;
}
.col-status {
  width: 9%;
}
.col-actions {
  width: 13%;
}

.employer-info {
  font-size: 0.85rem;
  line-height: 1.4;
}

.employer-info .bi {
  font-size: 0.9rem;
  color: #6c757d;
}

.employer-info a {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.75em;
  padding: 0.35em 0.7em;
  border-radius: 10px;
}

.d-flex.gap-2 {
  gap: 0.5rem;
}

/* Updated alert styles */
.alert {
  font-size: 0.85rem; /* Smaller font size */
  padding: 0.5rem 1rem; /* Reduced padding */
  margin: 1rem auto; /* Center horizontally with auto margins */
  max-width: 500px; /* Limit width */
  text-align: center; /* Center text */
  border-radius: 5px; /* Slightly rounded corners */
}

@media (max-width: 768px) {
  .table {
    min-width: 600px;
  }

  .table th,
  .table td {
    padding: 6px 8px;
    font-size: 0.75rem;
  }

  .btn-sm {
    padding: 0.15rem 0.3rem;
    font-size: 0.7rem;
  }

  .employer-info {
    font-size: 0.8rem;
  }

  .employer-info a {
    max-width: 120px;
  }

  .alert {
    font-size: 0.75rem; /* Even smaller font for mobile */
    padding: 0.4rem 0.8rem; /* Further reduced padding */
    max-width: 90%; /* Responsive width */
  }
}

.text-primary {
  color: #007bff;
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

</style>