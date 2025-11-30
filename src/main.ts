import { createApp } from "vue";
import "normalize.css";
// import "./style.css";
import "@/styles/element/index.scss";
import "@/styles/index.scss";

import ElementPlus from "element-plus";
import App from "./App.vue";

import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(ElementPlus);

app.mount("#app");
