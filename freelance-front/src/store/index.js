import { createStore } from "vuex";
import { auth } from "./modules/auth.module";
import { job } from "./modules/job.module";

export default createStore({
  modules: {
    auth,
    job,
  },
});
