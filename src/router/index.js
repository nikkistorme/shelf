import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Home from "../components/Home.vue";
import Shelves from "../components/Shelves.vue";
import AddBook from "../components/AddBook.vue";
import Account from "../components/Account.vue";
import Login from "../components/Login.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "*", redirect: "/home" },
    { path: "/home", component: Home, meta: { requiresAuth: true } },
    { path: "/shelves", component: Shelves, meta: { requiresAuth: true } },
    { path: "/add-book", component: AddBook, meta: { requiresAuth: true } },
    { path: "/account", component: Account, meta: { requiresAuth: true } },
    { path: "/login", component: Login }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (to.path === "/login" && currentUser) {
    next("/home");
  } else if (requiresAuth && !currentUser && to.path !== "/login") {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
