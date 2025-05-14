import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import JobsPage from '../views/JobsPage.vue'
import Candidates from '../views/Candidates.vue'
import Employers from '../views/Employers.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: JobsPage,
    meta: { requiresAuth: true }
  },
  { 
    path: "/candidates", 
    name: 'candidates',
    component: Candidates,
    meta: { requiresAuth: true }
  },
  { 
    path: "/employers", 
    name: 'employers',
    component: Employers,
    meta: { requiresAuth: true }
  },
  { 
    path: "/:pathMatch(.*)*", 
    name: 'not-found',
    component: NotFound 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'jobs' })
  } else {
    next()
  }
})

export default router
