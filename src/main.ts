import { createApp } from "vue";
import App from "./App.vue";
import router from "./lib/router";

import { IonicVue } from "@ionic/vue";

import "@ionic/vue/css/core.css";

import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

import "@ionic/vue/css/palettes/dark.system.css";

const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
  app.mount("#app");
});
