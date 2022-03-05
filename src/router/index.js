import { createRouter, createWebHistory } from "vue-router";
import fb from "../firebase";

import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/HomePage.vue";
import LibraryPage from "../views/LibraryPage.vue";
import SocialPage from "../views/SocialPage.vue";
import AccountPage from "../views/AccountPage.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/home", component: HomePage, meta: { requiresAuth: true } },
  { path: "/library", component: LibraryPage, meta: { requiresAuth: true } },
  { path: "/social", component: SocialPage, meta: { requiresAuth: true } },
  { path: "/account", component: AccountPage, meta: { requiresAuth: true } },
  { path: "/*", redirect: "/home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const currentUser = fb.auth.currentUser;

  if (to.path === "/" && currentUser) {
    next("/home");
  } else if (requiresAuth && !currentUser && to.path !== "/") {
    next("/");
  } else {
    next();
  }
});

export default router;
