<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Available Jobs</h2>

    <!-- Job Filter Component -->
    <JobFilter v-model:filters="filters" v-model:sort="sort" />

    <!-- Jobs List -->
    <div class="row">
      <div v-for="job in filteredAndSortedJobs" :key="job.id" class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ job.title }}</h5>
            <p class="card-text">{{ job.description }}</p>
            <p class="card-text"><strong>Company:</strong> {{ job.employer.name }}</p>
            <p class="card-text"><strong>Location:</strong> {{ job.location }}</p>
            <p class="card-text"><strong>Work Type:</strong> {{ job.work_type }}</p>
            <p class="card-text"><strong>Salary Range:</strong> ${{ job.salary_min }} - ${{ job.salary_max }}</p>
            <button v-if="userRole === 'candidate'" class="btn btn-primary" @click="applyJob(job.id)">Apply</button>
          </div>
        </div>
      </div>
    </div>
    <p v-if="filteredAndSortedJobs.length === 0" class="text-center">No jobs available.</p>
  </div>
</template>

<script>
import axios from 'axios';
import JobFilter from '../JobFilterComponent/JobFilterComponent.vue';

export default {
  name: 'Jobs',
  components: {
    JobFilter,
  },
  data() {
    return {
      jobs: [],
      user: JSON.parse(localStorage.getItem('user')) || {},
      filters: {
        location: '',
        work_type: '',
      },
      sort: {
        salary: '',
      },
    };
  },
  computed: {
    userRole() {
      return this.user.full_name ? 'candidate' : this.user.name ? 'employer' : null;
    },
    filteredAndSortedJobs() {
      let filteredJobs = [...this.jobs];

      if (this.filters.location) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(this.filters.location.toLowerCase())
        );
      }

      if (this.filters.work_type) {
        filteredJobs = filteredJobs.filter(job => job.work_type === this.filters.work_type);
      }

      if (this.sort.salary) {
        filteredJobs.sort((a, b) => {
          if (this.sort.salary === 'asc') {
            return (a.salary_min || 0) - (b.salary_min || 0);
          } else {
            return (b.salary_min || 0) - (a.salary_min || 0);
          }
        });
      }

      return filteredJobs;
    },
  },
  mounted() {
    this.fetchJobs();
  },
  methods: {
    async fetchJobs() {
      try {
        const response = await axios.get('http://localhost:8000/api/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.jobs = response.data;
      } catch (error) {
        alert('Failed to fetch jobs');
      }
    },
    applyJob(jobId) {
      if (this.userRole !== 'candidate') {
        alert('Only candidates can apply!');
        return;
      }
      alert(`Applied for job ID: ${jobId}`);
    },
  },
};
</script>