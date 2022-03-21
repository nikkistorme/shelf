<template>
  <div class="app-container d-flex flex-column">
    <PageModal />
    <SiteHeader v-if="!userLoading" />
    <router-view />
    <SiteFooter />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SiteHeader from "./components/SiteHeader/SiteHeader.vue";
import PageModal from "./components/PageModal.vue";
import SiteFooter from "./components/SiteFooter/SiteFooter.vue";

export default {
  name: "App",
  components: {
    SiteHeader,
    PageModal,
    SiteFooter,
  },
  computed: {
    ...mapGetters(["modalOpen", "userLoading"]),
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
