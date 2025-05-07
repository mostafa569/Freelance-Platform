import { createRouter, createWebHistory } from "vue-router";
import Candidates from "../pages/Candidates.vue";
import Employers from "../pages/Employers.vue";
import NotFound from "../pages/NotFound.vue";
import LandingPage from "../pages/LandingPage.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/candidates", component: Candidates },
  { path: "/employers", component: Employers },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const Router = createRouter({
  history: createWebHistory(),
  routes,
});
export default Router;
