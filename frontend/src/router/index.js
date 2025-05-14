import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/Login.vue';
import RegisterPage from '../views/Register.vue';
import JobsPage from '../views/Job.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/jobs', component: JobsPage },
  { path: '/', redirect: '/jobs' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;