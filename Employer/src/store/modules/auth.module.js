import AuthService from "@/services/auth.service";

const employer = JSON.parse(localStorage.getItem("employer"));
const initialState = employer
  ? { status: { loggedIn: true }, employer }
  : { status: { loggedIn: false }, employer: null };

export const auth = {
  namespaced: true,
  state: initialState,
  getters: {
    isLoggedIn: (state) => state.status.loggedIn,
    employer: (state) => state.employer,
  },
  actions: {
    register({ commit }, employer) {
      return AuthService.register(employer).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    login({ commit }, credentials) {
      return AuthService.login(credentials).then(
        (response) => {
          const { employer, token } = response.data;
          localStorage.setItem("employer", JSON.stringify(employer));
          localStorage.setItem("token", token);
          commit("loginSuccess", employer);
          return Promise.resolve(employer);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      return AuthService.logout().then(() => {
        localStorage.removeItem("employer");
        localStorage.removeItem("token");
        commit("logout");
      });
    },
    getProfile({ commit }) {
      return AuthService.getProfile().then(
        (response) => {
          commit("profileSuccess", response.data.employer);
          return Promise.resolve(response.data.employer);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateProfile({ commit }, profileData) {
      return AuthService.updateProfile(profileData).then(
        (response) => {
          const updatedEmployer = response.data.employer;
          localStorage.setItem("employer", JSON.stringify(updatedEmployer));
          commit("profileUpdated", updatedEmployer);
          return Promise.resolve(updatedEmployer);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    loginSuccess(state, employer) {
      state.status.loggedIn = true;
      state.employer = employer;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.employer = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.employer = null;
    },
    profileSuccess(state, employer) {
      state.employer = employer;
    },
    profileUpdated(state, employer) {
      state.employer = employer;
    },
  },
};
