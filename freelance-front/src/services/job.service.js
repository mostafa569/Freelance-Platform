import api from "./api";

class JobService {
  getJobs() {
    return api.get("/employer/jobs");
  }

  getJob(id) {
    if (!id) {
      return Promise.reject(new Error('Job ID is required'));
    }
    return api.get(`/employer/jobs/${id}`);
  }

  createJob(jobData) {
    return api.post("/employer/jobs", jobData);
  }

  updateJob(id, jobData) {
    if (!id) {
      return Promise.reject(new Error('Job ID is required'));
    }
    return api.put(`/employer/jobs/${id}`, jobData);
  }

  deleteJob(id) {
    if (!id) {
      return Promise.reject(new Error('Job ID is required'));
    }
    return api.delete(`/employer/jobs/${id}`);
  }
}

export default new JobService();
