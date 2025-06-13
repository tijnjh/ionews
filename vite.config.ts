import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [vue(), VitePWA({ registerType: "autoUpdate" })],
};
