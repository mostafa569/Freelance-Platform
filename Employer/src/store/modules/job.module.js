import JobService from "@/services/job.service";

export const job = {
  namespaced: true,
  state: {
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
  },
  getters: {
    allJobs: (state) => state.jobs,
    currentJob: (state) => state.currentJob,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    errorMessage: (state) => state.error,
  },
  actions: {
    fetchJobs({ commit }) {
      commit("setLoading", true);
      return JobService.getJobs().then(
        (response) => {
          commit("setJobs", response.data.jobs);
          commit("setLoading", false);
          return Promise.resolve(response.data.jobs);
        },
        (error) => {
          commit(
            "setError",
            error.response
              ? error.response.data.message
              : "حدث خطأ أثناء جلب الوظائف"
          );
          commit("setLoading", false);
          return Promise.reject(error);
        }
      );
    },
    fetchJobById({ commit }, id) {
      commit("setLoading", true);
      return JobService.getJob(id).then(
        (response) => {
          commit("setCurrentJob", response.data.job);
          commit("setLoading", false);
          return Promise.resolve(response.data.job);
        },
        (error) => {
          commit(
            "setError",
            error.response
              ? error.response.data.message
              : "حدث خطأ أثناء جلب الوظيفة"
          );
          commit("setLoading", false);
          return Promise.reject(error);
        }
      );
    },
    createJob({ commit }, jobData) {
      commit("setLoading", true);
      return JobService.createJob(jobData).then(
        (response) => {
          commit("addJob", response.data.job);
          commit("setLoading", false);
          return Promise.resolve(response.data);
        },
        (error) => {
          commit(
            "setError",
            error.response
              ? error.response.data.message
              : "حدث خطأ أثناء إنشاء الوظيفة"
          );
          commit("setLoading", false);
          return Promise.reject(error);
        }
      );
    },
    updateJob({ commit }, { id, jobData }) {
      commit("setLoading", true);
      return JobService.updateJob(id, jobData).then(
        (response) => {
          commit("updateJobInList", response.data.job);
          commit("setLoading", false);
          return Promise.resolve(response.data);
        },
        (error) => {
          commit(
            "setError",
            error.response
              ? error.response.data.message
              : "حدث خطأ أثناء تحديث الوظيفة"
          );
          commit("setLoading", false);
          return Promise.reject(error);
        }
      );
    },
    deleteJob({ commit }, id) {
      commit("setLoading", true);
      return JobService.deleteJob(id).then(
        (response) => {
          commit("removeJob", id);
          commit("setLoading", false);
          return Promise.resolve(response.data);
        },
        (error) => {
          commit(
            "setError",
            error.response
              ? error.response.data.message
              : "حدث خطأ أثناء حذف الوظيفة"
          );
          commit("setLoading", false);
          return Promise.reject(error);
        }
      );
    },
    clearError({ commit }) {
      commit("clearError");
    },
  },
  mutations: {
    setJobs(state, jobs) {
      state.jobs = jobs;
    },
    setCurrentJob(state, job) {
      state.currentJob = job;
    },
    addJob(state, job) {
      state.jobs.unshift(job);
    },
    updateJobInList(state, updatedJob) {
      const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
      if (index !== -1) {
        state.jobs.splice(index, 1, updatedJob);
      }
      if (state.currentJob && state.currentJob.id === updatedJob.id) {
        state.currentJob = updatedJob;
      }
    },
    removeJob(state, id) {
      state.jobs = state.jobs.filter((job) => job.id !== id);
      if (state.currentJob && state.currentJob.id === id) {
        state.currentJob = null;
      }
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
};
