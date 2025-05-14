import api from "./api";

class AuthService {
  register(employer) {
    return api.post("/employer/register", employer);
  }

  login(credentials) {
    return api.post("/employer/login", credentials);
  }

  logout() {
    return api.post("/logout");
  }

  getProfile() {
    return api.get("/employer/profile");
  }

  updateProfile(profileData) {
    return api.put("/employer/profile", profileData);
  }
}

export default new AuthService();
