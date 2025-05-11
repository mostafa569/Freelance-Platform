<template>
  <div class="job-view-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="error-container">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Job not found
      </div>
      <router-link to="/jobs" class="btn btn-outline-primary">
        <i class="bi bi-arrow-left me-1"></i> Back to Jobs
      </router-link>
    </div>

    <!-- Job Details -->
    <div v-else class="job-details-card">
      <div class="job-header">
        <div class="job-title-container">
          <h1 class="job-title">{{ job.title }}</h1>
          <div class="job-status-badge" :class="getStatusBadgeClass(job.status)">
            {{ formatStatus(job.status) }}
          </div>
        </div>
        <div class="job-meta">
          <div class="company-info">
            <i class="bi bi-building"></i>
            <span>{{ job.company_name || 'Not specified' }}</span>
          </div>
          <div class="post-date">
            <i class="bi bi-calendar3"></i>
            <span>Posted on {{ formatDate(job.created_at) }}</span>
          </div>
        </div>
      </div>

      <div class="job-content">
        <!-- Key Details -->
        <div class="key-details-section">
          <div class="detail-card">
            <i class="bi bi-geo-alt-fill"></i>
            <div>
              <h6>Location</h6>
              <p>{{ job.location }}</p>
            </div>
          </div>
          <div class="detail-card">
            <i class="bi bi-laptop"></i>
            <div>
              <h6>Work Type</h6>
              <p>{{ getWorkTypeLabel(job.work_type) }}</p>
            </div>
          </div>
          <div class="detail-card">
            <i class="bi bi-cash-stack"></i>
            <div>
              <h6>Salary Range</h6>
              <p>${{ job.salary_min }} - ${{ job.salary_max }}</p>
            </div>
          </div>
          <div class="detail-card">
            <i class="bi bi-clock"></i>
            <div>
              <h6>Deadline</h6>
              <p>{{ formatDate(job.application_deadline) }}</p>
            </div>
          </div>
        </div>

        <!-- Job Description -->
        <div class="content-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Job Description
          </h3>
          <div class="section-content" v-html="formatText(job.description)"></div>
        </div>

        <!-- Responsibilities -->
        <div class="content-section">
          <h3 class="section-title">
            <i class="bi bi-list-check"></i>
            Responsibilities
          </h3>
          <div class="section-content" v-html="formatText(job.responsibilities)"></div>
        </div>

        <!-- Qualifications -->
        <div class="content-section">
          <h3 class="section-title">
            <i class="bi bi-award"></i>
            Qualifications
          </h3>
          <div class="section-content" v-html="formatText(job.qualifications)"></div>
        </div>

        <!-- Benefits -->
        <div v-if="job.benefits" class="content-section">
          <h3 class="section-title">
            <i class="bi bi-gift"></i>
            Benefits
          </h3>
          <div class="section-content" v-html="formatText(job.benefits)"></div>
        </div>
      </div>

      <div class="job-footer">
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i> Back to Jobs
        </button>
        <div v-if="isEditable" class="action-buttons">
          <router-link :to="`/jobs/${job.id}/edit`" class="btn btn-primary">
            <i class="bi bi-pencil-square me-1"></i> Edit Job
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JobService from '@/services/job.service';

export default {
  name: "JobView",
  props: {
    id: {
      type: [String, Number],
      required: false
    }
  },
  data() {
    return {
      job: {},
      loading: true,
      notFound: false
    };
  },
  computed: {
    isEditable() {
      // Add logic to determine if the job is editable (e.g., based on user role or job status)
      return true;
    }
  },
  created() {
    this.fetchJob();
  },
  methods: {
    fetchJob() {
      const jobId = this.id || this.$route.params.id;
      this.loading = true;
      
      JobService.getJob(jobId)
        .then(response => {
          this.job = response.data.job || response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          if (error.response && error.response.status === 404) {
            this.notFound = true;
          }
        });
    },
    formatDate(dateString) {
      if (!dateString) return 'Not specified';
      try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
      } catch (e) {
        console.error('Date formatting error:', e);
        return dateString;
      }
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
    formatStatus(status) {
      if (!status) return 'Unknown';
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'active': return 'bg-success';
        case 'pending': return 'bg-warning text-dark';
        case 'closed': return 'bg-secondary';
        case 'draft': return 'bg-info';
        default: return 'bg-secondary';
      }
    },
    formatText(text) {
      if (!text) return '';
      // Convert newlines to <br> tags and preserve other HTML
      return text.replace(/\n/g, '<br>');
    },
    goBack() {
      this.$router.push('/jobs');
    }
  }
};
</script>

<style scoped>
.job-view-container {
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

.job-details-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.job-header {
  padding: 2rem;
  background: linear-gradient(145deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.job-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.job-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(120deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.job-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.job-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  color: #64748b;
}

.job-meta i {
  margin-right: 0.5rem;
}

.job-content {
  padding: 2rem;
}

.key-details-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.detail-card i {
  font-size: 1.25rem;
  color: #3b82f6;
  margin-top: 0.25rem;
}

.detail-card h6 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.detail-card p {
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
  margin: 0;
}

.content-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3b82f6;
}

.section-content {
  color: #334155;
  line-height: 1.6;
  white-space: pre-line;
}

.job-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn-outline-secondary {
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .job-view-container {
    padding: 1.5rem;
  }
  
  .job-header, .job-content, .job-footer {
    padding: 1.5rem;
  }
  
  .job-title {
    font-size: 1.75rem;
  }
  
  .key-details-section {
    grid-template-columns: 1fr 1fr;
  }
  
  .job-footer {
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: flex-end;
  }
}

@media (max-width: 576px) {
  .key-details-section {
    grid-template-columns: 1fr;
  }
  
  .job-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>