import Vue from "vue";
import VueResource from "vue-resource";
import router from "./router";
import { store } from "./store/store";
const fb = require("./firebaseConfig.js");
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";

library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(VueResource);

let app;
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("getUserShelvesBooks");
  }
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
  }
});
