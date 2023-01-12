<template>
  <nav class="header-nav d-flex ai-center mr-2">
    <ul class="nav-list d-flex gap-1">
      <li class="nav-list-item">
        <NuxtLink to="/home">Home</NuxtLink>
      </li>

      <li v-if="profile?.id" class="nav-list-item">
        <NuxtLink to="/shelves">Library</NuxtLink>
      </li>

      <li class="nav-list-item">
        <NuxtLink href="https://trello.com/b/HG9elwZ0/roadmap" target="_blank">
          Roadmap
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
import { storeToRefs } from "pinia";
import { useUserStore } from "~/store/UserStore";

export default {
  setup() {
    const userStore = useUserStore();
    const { profile } = storeToRefs(userStore);
    return {
      profile,
    };
  },
};
</script>

<style scoped>
@media (max-width: 767px) {
  .header-nav {
    display: none;
    visibility: none;
  }
}
.nav-list-item a {
  text-decoration: none;
  color: var(--color-white);
}
</style>
