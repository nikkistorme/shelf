<template>
  <div class="app-container d-flex flex-column">
    <PageModal />
    <SiteHeader v-if="!userLoading" />
    <router-view class="app-content" />
    <AddBookButton />
    <!-- <SiteFooter /> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SiteHeader from "./components/SiteHeader/SiteHeader.vue";
import PageModal from "./components/PageModal.vue";
// import SiteFooter from "./components/SiteFooter/SiteFooter.vue";
import AddBookButton from "./components/AddBookButton.vue";

export default {
  name: "App",
  components: {
    SiteHeader,
    PageModal,
    // SiteFooter,
    AddBookButton,
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

<style>
.app-content {
  min-height: calc(100vh - var(--header-height));
}
</style>
