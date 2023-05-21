import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

import "./style.css";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(Toast, {
  position: "bottom-center",
  hideProgressBar: true,
});

app.mount("#app");
