import { createApp } from "vue";
import router from "./router/index.js";
import store from "./store/store.js";
import fb from "./firebase";
import App from "./App.vue";
import "./index.css";

import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

let app;
fb.auth.onAuthStateChanged(async (user) => {
  if (user) {
    store.commit("setUser", user);
    await store.dispatch("getUserProfile", user.uid);
    await Promise.all([
      store.dispatch("getBooks"),
      store.dispatch("getShelves"),
    ]);
    store.commit("setActiveShelf", store.getters.getAllBooksShelf);
    router.push("/home");
  }
  if (!app) {
    app = createApp(App).use(router).use(store).mount("#app");
  }
});
