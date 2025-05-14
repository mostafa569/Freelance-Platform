import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// استيراد Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// استيراد Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";
// استيراد Bootstrap JavaScript
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");

