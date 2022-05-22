<template>
  <header
    v-if="isAuthenticated"
    class="site-header d-flex ai-center jc-space-between"
  >
    <div class="left d-flex ai-center">
      <HeaderLogo />
      <HeaderNavigation class="desktop-only" />
    </div>
    <div class="d-flex jc-end ai-center gap-1 right">
      <!-- <HeaderSearch /> -->
      <HeaderProfile class="desktop-only" />
      <MobileNavigation class="mobile-only" />
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

import HeaderLogo from "./HeaderLogo.vue";
import HeaderNavigation from "./HeaderNavigation.vue";
// import HeaderSearch from "./HeaderSearch.vue";
import HeaderProfile from "./HeaderProfile.vue";
import MobileNavigation from "./MobileNavigation.vue";

export default {
  components: {
    HeaderLogo,
    HeaderNavigation,
    // HeaderSearch,
    HeaderProfile,
    MobileNavigation,
  },
  data() {
    return {
      dropdownOpen: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    isAuthenticated() {
      return this.user.uid;
    },
  },
};
</script>

<style>
.site-header {
  position: relative;
  height: var(--header-height);
  padding: 0 var(--spacing-root);
  /* box-shadow: var(--box-shadow-2); */
  border-bottom: 2px solid var(--color-grey);
}
.site-header .right {
  flex: 1;
}

@media (min-width: 768px) {
  .site-header {
    /* height: 75px; */
    padding: 0 var(--spacing-size-4);
  }
}
</style>
