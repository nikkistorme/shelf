<template>
  <header
    v-if="isAuthenticated"
    class="site-header d-flex ai-center jc-space-between"
  >
    <div class="left d-flex ai-center">
      <HeaderLogo />
      <HeaderNavigation />
      <HeaderSearch />
    </div>
    <div class="right">
      <HeaderProfile />
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

import HeaderLogo from "./HeaderLogo.vue";
import HeaderNavigation from "./HeaderNavigation.vue";
import HeaderSearch from "./HeaderSearch.vue";
import HeaderProfile from "./HeaderProfile.vue";

export default {
  components: {
    HeaderLogo,
    HeaderNavigation,
    HeaderSearch,
    HeaderProfile,
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
  height: 70px;
  padding: 0 var(--spacing-root);
  box-shadow: var(--box-shadow-2);
}

@media (min-width: 768px) {
  .site-header {
    height: 75px;
    padding: 0 var(--spacing-size-4);
  }
}
</style>
