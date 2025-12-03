import { createApp } from "vue";
import "normalize.css";
// import "./style.css";
import "@/styles/element/index.scss";
import "@/styles/index.scss";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";

import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
});

app.mount("#app");
