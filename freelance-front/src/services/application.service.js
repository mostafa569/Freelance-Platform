import api from "./api";

class ApplicationService {
  getApplications() {
    return api.get("/employer/applications");
  }

  getApplication(id) {
    if (!id) {
      return Promise.reject(new Error('Application ID is required'));
    }
    return api.get(`/employer/applications/${id}`);
  }

  updateApplicationStatus(id, status) {
    if (!id) {
      return Promise.reject(new Error('Application ID is required'));
    }
    
    // طباعة المعرف والحالة للتأكد من صحتهما
    console.log(`Updating application ${id} status to ${status}`);
    
    // استخدام المسار الصحيح وفقًا للـ API
    return api.put(`/employer/applications/${id}/status/${status}`, {});
  }

  deleteApplication(id) {
    if (!id) {
      return Promise.reject(new Error('Application ID is required'));
    }
    return api.delete(`/employer/applications/${id}`);
  }
}

export default new ApplicationService();





