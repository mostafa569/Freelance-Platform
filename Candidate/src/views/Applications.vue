<template>
  <div class="applications-page">
    <NavBar />
    <div class="container mt-4">
      <div class="page-header">
        <h1 class="page-title">My Applications</h1>
        <p class="page-subtitle">Track your job application status</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="applications.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="bi bi-file-earmark-text"></i>
        </div>
        <h3>No Applications Yet</h3>
        <p>You haven't applied to any jobs yet.</p>
        <router-link to="/jobs" class="btn btn-primary">
          Browse Jobs
        </router-link>
      </div>

      <div v-else class="applications-grid">
        <div v-for="application in applications" :key="application.application_id" class="application-card">
          <div class="card-header">
            <div class="job-title">
              <h3>{{ application.title || 'Unknown Job' }}</h3>
              <p class="company">{{ application.company || 'Unknown Company' }}</p>
            </div>
            <div class="status-badge" :class="getStatusClass(application.status || 'pending')">
              {{ application.status || 'Pending' }}
            </div>
          </div>

          <div class="card-body">
            <div class="job-details">
              <div class="detail-item">
                <i class="bi bi-geo-alt"></i>
                <span>{{ application.location || 'Unknown Location' }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-briefcase"></i>
                <span>{{ application.work_type || '-' }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-cash"></i>
                <span v-if="application.salary_min && application.salary_max">
                  {{ formatSalary(application.salary_min) }} - {{ formatSalary(application.salary_max) }}
                </span>
                <span v-else>-</span>
              </div>
            </div>

            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-label">Deadline</div>
                <div class="timeline-value">{{ formatDate(application.application_deadline) }}</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-label">Applied on</div>
                <div class="timeline-value">{{ formatDate(application.applied_at) }}</div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button 
              @click="deleteApplication(application.id)" 
              class="btn btn-withdraw"
              :disabled="isDeleting === application.id || application.status?.toLowerCase() !== 'pending'"
              v-if="application.status?.toLowerCase() === 'pending'"
            >
              <span v-if="isDeleting === application.id" class="spinner-border spinner-border-sm me-1"></span>
              Withdraw Application
            </button>
            <div v-else class="status-note">
              <i class="bi bi-info-circle"></i>
              <span>Cannot withdraw processed applications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import api from '../services/api';

const applications = ref([]);
const loading = ref(true);
const isDeleting = ref(null);

onMounted(async () => {
  await fetchApplications();
});

const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await api.getApplications();
    applications.value = response.data || [];
  } catch (error) {
    console.error('Failed to fetch applications:', error);
  } finally {
    loading.value = false;
  }
};

const deleteApplication = async (id) => {
  isDeleting.value = id;
  try {
    await api.deleteApplication(id);
    applications.value = applications.value.filter(app => app.application_id !== id);
  } catch (error) {
    console.error('Failed to delete application:', error);
  } finally {
    isDeleting.value = null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatSalary = (value) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0
  }).format(value);
};

const getStatusClass = (status) => {
  const statusLower = status.toLowerCase();
  return {
    'pending': 'status-pending',
    'accepted': 'status-accepted',
    'rejected': 'status-rejected',
    'interview': 'status-interview'
  }[statusLower] || 'status-default';
};
</script>

<style scoped>
.applications-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 3rem;
}

.page-header {
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

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-state-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #334155;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.application-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.job-title h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.company {
  color: #64748b;
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
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

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.job-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-item i {
  color: #94a3b8;
}

.timeline {
  border-top: 1px dashed #e2e8f0;
  padding-top: 1rem;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.timeline-label {
  color: #64748b;
  font-size: 0.85rem;
}

.timeline-value {
  color: #334155;
  font-weight: 500;
  font-size: 0.9rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.btn-withdraw {
  background: none;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-withdraw:hover:not(:disabled) {
  background-color: #fee2e2;
}

.btn-withdraw:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.status-note i {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
    padding-left: 1rem;
  }
  
  .page-subtitle {
    margin-left: 1rem;
    font-size: 1rem;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>