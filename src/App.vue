<template>
  <div class="app-container">
    <PageModal />
    <SiteHeader />
    <router-view />
    <SiteBottomNavigation />
    <SiteFooter />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SiteHeader from "./components/SiteHeader/SiteHeader.vue";
import SiteBottomNavigation from "./components/SiteBottomNavigation.vue";
import PageModal from "./components/PageModal.vue";

export default {
  name: "App",
  components: {
    SiteHeader,
    SiteBottomNavigation,
    PageModal,
  },
  computed: {
    ...mapGetters(["modalOpen"]),
  },
  watch: {
    modalOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
  },
};
</script>
