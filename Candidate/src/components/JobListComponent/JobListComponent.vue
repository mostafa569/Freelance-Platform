<template>
  <div class="jobs-page">
    <NavBar />
    
    <!-- Toast Notification -->
    <div class="top-0 end-0 p-3" style="z-index: 11">
      <div v-if="toast.show" class="toast show" :class="`toast-${toast.type}`" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">{{ toast.title }}</strong>
          <button type="button" class="btn-close" @click="toast.show = false" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
    
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar with filters -->
        <div class="col-lg-3 mb-4">
          <div class="filter-container p-3 mb-4 rounded shadow-sm">
            <h4 class="filter-heading mb-3">Filter Jobs</h4>
            
            <div class="mb-3">
                <label for="locationFilter" class="form-label">Location</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                    <input 
                        v-model="filters.location" 
                        type="text" 
                        class="form-control" 
                        id="locationFilter"
                        placeholder="e.g., Cairo" 
                    >
                </div>
            </div>
            
            <div class="mb-3">
                <label for="workTypeFilter" class="form-label">Work Type</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
                    <select 
                        v-model="filters.work_type" 
                        class="form-select" 
                        id="workTypeFilter"
                    >
                        <option value="">All Types</option>
                        <option value="remote">Remote</option>
                        <option value="onsite">Onsite</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="sortSalary" class="form-label">Salary Range</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-cash"></i></span>
                    <select 
                        v-model="sort.salary" 
                        class="form-select" 
                        id="sortSalary"
                    >
                        <option value="">No Sorting</option>
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                    </select>
                </div>
            </div>
            
            <div class="d-grid gap-2 mt-4">
                <button 
                    class="btn btn-primary" 
                    @click="resetFilters"
                >
                    <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
                </button>
            </div>
          </div>
        </div>
        
        <!-- Main content with job listings -->
        <div class="col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="job-list-title">Available Positions</h2>
            <span class="badge rounded-pill job-count">{{ filteredJobs.length }} jobs found</span>
          </div>
          
          <div v-if="loading" class="d-flex justify-content-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="filteredJobs.length === 0" class="text-center my-5">
            <div class="empty-state">
              <i class="bi bi-search fs-1 text-muted"></i>
              <h3 class="mt-3">No jobs found</h3>
              <p class="text-muted">Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          </div>
          
          <div v-else class="job-list">
            <div v-for="job in filteredJobs" :key="job.id" class="job-card">
              <div class="job-header">
                <h2 class="job-title">{{ job.title }}</h2>
                <span class="job-salary">${{ job.salary_min }} - ${{ job.salary_max }}</span>
              </div>
              
              <div class="job-company">
                <span class="company-name">{{ job.company }}</span>
                <span class="job-location">
                  <i class="bi bi-geo-alt"></i> {{ job.location }}
                </span>
              </div>
              
              <div class="job-details">
                <span class="job-type">
                  <i class="bi bi-briefcase"></i> {{ job.work_type }}
                </span>
                <span class="job-posted">
                  <i class="bi bi-calendar"></i> Posted {{ formatDate(job.created_at) }}
                </span>
              </div>
              
              <p class="job-description">{{ truncateDescription(job.description) }}</p>
              
              <div class="job-actions">
                <div v-if="getApplicationStatus(job.id) || localApplications.includes(job.id)" class="application-status">
                  <span class="status-badge" :class="getStatusClass(getApplicationStatus(job.id) || 'pending')">
                    <i class="bi" :class="getStatusIcon(getApplicationStatus(job.id) || 'pending')"></i>
                    {{ getApplicationStatus(job.id) || 'Pending' }}
                  </span>
                  <span class="status-date">Applied {{ getApplicationDate(job.id) || 'Just now' }}</span>
                </div>
                <button 
                  v-else
                  @click="applyJob(job.id)" 
                  class="btn btn-primary apply-btn"
                  :disabled="isApplying === job.id"
                >
                  <span v-if="isApplying === job.id" class="spinner-border spinner-border-sm me-1"></span>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '../NavBar.vue';
import api from '../../services/api';

const jobs = ref([]);
const loading = ref(true);
const isApplying = ref(null);
const filters = ref({
  location: '',
  work_type: '',
});
const sort = ref({
  salary: '',
});
const applications = ref([]);
const localApplications = ref([]);
const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
});

const user = computed(() => {
  return JSON.parse(localStorage.getItem('user')) || {};
});

const filteredJobs = computed(() => {
  console.log("Filtering jobs with location:", filters.value.location);
  
  let result = [...jobs.value];
  
  // Apply location filter
  if (filters.value.location && filters.value.location.trim() !== '') {
    const locationFilter = filters.value.location.toLowerCase().trim();
    console.log("Applying location filter:", locationFilter);
    
    result = result.filter(job => {
      const jobLocation = job.location ? job.location.toLowerCase() : '';
      console.log(`Job ${job.id} location: "${jobLocation}"`);
      return jobLocation.includes(locationFilter);
    });
    
    console.log("After location filter, jobs count:", result.length);
  }
  
  // Apply work type filter
  if (filters.value.work_type && filters.value.work_type !== '') {
    result = result.filter(job => job.work_type === filters.value.work_type);
  }
  
  // Apply sorting
  if (sort.value.salary === 'asc') {
    result.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
  } else if (sort.value.salary === 'desc') {
    result.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
  }
  
  return result;
});

onMounted(async () => {
  await Promise.all([fetchJobs(), fetchApplications()]);
});

const fetchJobs = async () => {
  loading.value = true;
  try {
    const response = await api.getJobs();
    jobs.value = response.data;
    console.log("Fetched jobs:", jobs.value);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    showToast('Error', 'Failed to load jobs', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchApplications = async () => {
  try {
    const response = await api.getApplications();
    applications.value = response.data;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
  }
};

const applyJob = async (jobId) => {
  isApplying.value = jobId;
  
  // Immediately add to local applications for UI feedback
  localApplications.value.push(jobId);
  
  try {
    const response = await api.applyJob(jobId);
    applications.value.push(response.data);
    showToast('Success', 'Application submitted successfully!', 'success');
  } catch (error) {
    // If there's an error, remove from local applications
    localApplications.value = localApplications.value.filter(id => id !== jobId);
    
    if (error.response && error.response.status === 409) {
      showToast('Info', 'You have already applied to this job', 'info');
      // If already applied, add to applications array to show status
      const existingApp = { job_id: jobId, status: 'Pending', applied_at: new Date().toISOString() };
      applications.value.push(existingApp);
    } else {
      showToast('Error', 'Failed to apply for this job', 'error');
      console.error('Application error:', error);
    }
  } finally {
    isApplying.value = null;
  }
};

const resetFilters = () => {
  filters.value.location = '';
  filters.value.work_type = '';
  sort.value.salary = '';
};

const showToast = (title, message, type = 'success') => {
  toast.value = { show: true, title, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 5000);
};

const getApplicationStatus = (jobId) => {
  const application = applications.value.find(app => app.job_id === jobId);
  return application?.status || null;
};

const getApplicationDate = (jobId) => {
  const application = applications.value.find(app => app.job_id === jobId);
  if (!application) return '';
  return formatDate(application.applied_at);
};

const getStatusClass = (status) => {
  const statusLower = status?.toLowerCase();
  return {
    'pending': 'status-pending',
    'accepted': 'status-accepted',
    'rejected': 'status-rejected',
    'interview': 'status-interview'
  }[statusLower] || 'status-default';
};

const getStatusIcon = (status) => {
  const statusLower = status?.toLowerCase();
  return {
    'pending': 'bi-hourglass',
    'accepted': 'bi-check-circle',
    'rejected': 'bi-x-circle',
    'interview': 'bi-calendar-check'
  }[statusLower] || 'bi-info-circle';
};

const truncateDescription = (text) => {
  if (!text) return '';
  return text.length > 200 ? text.substring(0, 200) + '...' : text;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};
</script>

<style scoped>
.jobs-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.job-list-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.job-count {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.job-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.job-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.job-salary {
  font-weight: 600;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.job-company {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.company-name {
  font-weight: 500;
  color: #64748b;
  font-size: 1.1rem;
}

.job-location {
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.job-details {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.job-type, .job-posted {
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.job-description {
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.job-actions {
  display: flex;
  justify-content: flex-end;
}

.apply-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.apply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.apply-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.application-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-pending {
  background-color: #fef9c3;
  color: #854d0e;
}

.status-accepted {
  background-color: #dcfce7;
  color: #166534;
}

.status-rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-interview {
  background-color: #e0f2fe;
  color: #075985;
}

.status-default {
  background-color: #f1f5f9;
  color: #334155;
}

.status-date {
  font-size: 0.75rem;
  color: #64748b;
}

/* Toast styles */
.toast {
  position: fixed;
  overflow: hidden;
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.toast-success {
  background-color: #f0fdf4;
  border-left: 4px solid #10b981;
}

.toast-error {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

.toast-info {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.toast-header {
  /* margin-top:100px; */
  
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.toast-success .toast-header {
  color: #10b981;
}

.toast-error .toast-header {
  color: #ef4444;
}

.toast-info .toast-header {
  color: #3b82f6;
}

@media (max-width: 992px) {
  .job-list-title {
    font-size: 1.5rem;
  }
  
  .job-count {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .job-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .job-company {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .job-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
