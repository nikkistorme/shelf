import { createApp } from "vue";
import router from "./router/index.js";
import store from "./store/store.js";
import fb from "./firebase";
import App from "./App.vue";
import "./index.css";

let app;
fb.auth.onAuthStateChanged((user) => {
  if (user) {
    store.commit("setUser", user);
    store.dispatch("getUserProfile", user.uid);
    store.dispatch("getBooks");
    store.dispatch("getShelves");
    router.push("/home");
  }
  if (!app) {
    app = createApp(App).use(router).use(store).mount("#app");
  }
});
