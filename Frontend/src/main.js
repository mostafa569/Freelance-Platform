import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "./routers/index";

import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(Router).mount("#app");
