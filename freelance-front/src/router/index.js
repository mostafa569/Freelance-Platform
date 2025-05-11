import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";
import JobCreate from "../components/jobs/JobCreate.vue";
import JobEdit from "../components/jobs/JobEdit.vue";
import JobList from "../components/jobs/JobList.vue";
import JobView from "../components/jobs/JobView.vue";
import ApplicationList from "../components/applications/ApplicationList.vue";
import ApplicationView from "../components/applications/ApplicationView.vue";
import EmployerProfile from "../components/profile/EmployerProfile.vue";
import store from "../store";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { 
    path: "/jobs/create", 
    component: JobCreate,
    meta: { requiresAuth: true }
  },
  { 
    path: "/jobs/:id/edit", 
    component: JobEdit, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: "/jobs/:id", 
    component: JobView, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: "/jobs", 
    component: JobList,
    meta: { requiresAuth: true }
  },
  { 
    path: "/applications", 
    component: ApplicationList,
    meta: { requiresAuth: true }
  },
  { 
    path: "/applications/:id", 
    component: ApplicationView, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: "/profile", 
    component: EmployerProfile,
    meta: { requiresAuth: true }
  },
  { 
    path: "/dashboard", 
    redirect: "/jobs",
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// حماية المسارات
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  
  // إذا كان المسار يتطلب تسجيل الدخول ولم يتم تسجيل الدخول
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
