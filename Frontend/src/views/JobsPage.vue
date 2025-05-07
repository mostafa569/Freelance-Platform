<template>
  <div class="">
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        v-if="isSuccess"
        class="alert alert-success alert-dismissible fade show shadow-sm"
        role="alert"
      >
        {{ successMessage }}
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

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="isFailed" class="error-container">
      <div class="text-center text-danger mt-5 fs-1 fw-bold">
        Error fetching jobs
      </div>
      <div class="text-center text-danger mt-2">
        {{ errorMessage }}
      </div>
    </div>

    <div v-else class="content-container">
      <div class="header-section">
        <h1 class="page-title">Job Listings</h1>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-header">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">TITLE</th>
                <th scope="col">EMPLOYER</th>
                <th scope="col">DESCRIPTION</th>
                <th scope="col">SALARY RANGE</th>
                <th scope="col">LOCATION</th>
                <th scope="col">WORK TYPE</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="jobs.data.length === 0">
  <td colspan="9" class="text-center py-4">No jobs found</td>
</tr>
<tr
  v-for="job in jobs.data"
  :key="job.id"
  class="table-row"
>
                <th scope="row">{{ job.id }}</th>
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
                    <button 
                      class="btn btn-sm btn-success" 
                      @click="approveJob(job.id)" 
                      :disabled="job.processing"
                    >
                      <span v-if="job.processing" class="spinner-border spinner-border-sm me-1"></span>
                      Approve
                    </button>
                    <button 
                      class="btn btn-sm btn-danger" 
                      @click="declineJob(job.id)" 
                      :disabled="job.processing"
                    >
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
      <div class="flexdiv"></div>
     <!-- Replace your current pagination-container with this: -->
     <div class="pagination-container">
  <div class="records-info">
    Showing {{ jobs.data.length ? jobs.from : 0 }} to {{ jobs.to || 0 }} of {{ jobs.total || 0 }} records
  </div>

  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !jobs.prev_page_url }">
        <button class="page-link" @click="fetchJobs(jobs.current_page - 1)" :disabled="!jobs.prev_page_url">&laquo;</button>
      </li>
      <li v-for="page in getPageNumbers()" :key="page" class="page-item" :class="{ active: page === jobs.current_page }">
        <button class="page-link" @click="fetchJobs(page)">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: !jobs.next_page_url }">
        <button class="page-link" @click="fetchJobs(jobs.current_page + 1)" :disabled="!jobs.next_page_url">&raquo;</button>
      </li>
    </ul>
  </nav>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const jobs = ref({
  data: [],
  meta: {},
  links: []
});
const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);
const isFailed = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const fetchJobs = async (page = 1) => {
  isLoading.value = true;
  isFailed.value = false;
  
  try {
    const response = await api.getAllJobs(page);
    
    if (response.data) {
      // Store the entire pagination object directly
      jobs.value = response.data;
      
      // Add processing flag to each job
      jobs.value.data = jobs.value.data.map(job => ({
        ...job,
        processing: false
      }));
    } else {
      console.error("Unexpected response format:", response.data);
      isFailed.value = true;
      errorMessage.value = 'Unexpected data format received from server';
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    isFailed.value = true;
    errorMessage.value = error.response?.data?.message || 'Failed to fetch jobs';
  } finally {
    isLoading.value = false;
  }
};

// Helper function to generate page numbers
const getPageNumbers = () => {
  if (!jobs.value || !jobs.value.last_page) return [];
  
  const currentPage = jobs.value.current_page;
  const lastPage = jobs.value.last_page;
  const delta = 2; // Number of pages to show before and after current page
  
  let pages = [];
  
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(lastPage, currentPage + delta); i++) {
    pages.push(i);
  }
  
  return pages;
};

const approveJob = async (id) => {
  const job = jobs.value.find(j => j.id === id);
  if (job) job.processing = true;
  
  try {
    await api.approveJob(id);
    isSuccess.value = true;
    successMessage.value = 'Job approved successfully';
    setTimeout(() => {
      isSuccess.value = false;
    }, 2000);
    await fetchJobs();
  } catch (error) {
    console.error("Error approving job:", error);
    isError.value = true;
    errorMessage.value = error.response?.data?.message || 'Failed to approve job';
    setTimeout(() => {
      isError.value = false;
    }, 2000);
  } finally {
    if (job) job.processing = false;
  }
};

const declineJob = async (id) => {
  const job = jobs.value.find(j => j.id === id);
  if (job) job.processing = true;
  
  try {
    await api.declineJob(id);
    isSuccess.value = true;
    successMessage.value = 'Job rejected successfully';
    setTimeout(() => {
      isSuccess.value = false;
    }, 2000);
    await fetchJobs();
  } catch (error) {
    console.error("Error rejecting job:", error);
    isError.value = true;
    errorMessage.value = error.response?.data?.message || 'Failed to reject job';
    setTimeout(() => {
      isError.value = false;
    }, 2000);
  } finally {
    if (job) job.processing = false;
  }
};

const formatSalary = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const truncateDescription = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const formatWorkType = (type) => {
  const types = {
    'remote': 'Remote',
    'onsite': 'On-Site',
    'hybrid': 'Hybrid'
  };
  return types[type] || type;
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved': return 'bg-success';
    case 'rejected': return 'bg-danger';
    case 'pending': return 'bg-warning';
    default: return 'bg-secondary';
  }
};

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  min-height: calc(100vh - 1rem);
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
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

.flexdiv {
  flex: 1;
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

.table-row th {
  padding: 1.5rem 1rem;
  font-weight: 600;
  color: #334155;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
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

.badge {
  font-size: 0.75em;
  padding: 0.35em 0.7em;
  border-radius: 10px;
}

.pagination-container {
  margin-top: 1rem;
  padding: 1.5rem;
}

.records-info {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.pagination {
  gap: 0.5rem;
  margin: 0;
}

.page-link {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.page-link:hover {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  border-color: #cbd5e1;
  color: #334155;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.page-item.disabled .page-link {
  color: #94a3b8;
  pointer-events: none;
  background-color: #f8fafc;
  border-color: #e2e8f0;
  box-shadow: none;
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
  .table-header th,
  .table-row td,
  .table-row th {
    padding: 1.2rem 0.75rem;
    font-size: 0.9rem;
  }

  .btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-link {
    padding: 0.5rem 1rem;
  }
  
  .employer-info {
    font-size: 0.8rem;
  }
  
  .employer-info a {
    max-width: 120px;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>

