<template>
  <div class="page-modal" :class="{ open: modalOpen }">
    <div class="page-modal__overlay" @click="shutItDown"></div>
    <BookDetails />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import BookDetails from "./BookDetails/BookDetails.vue";

export default {
  components: { BookDetails },
  computed: {
    ...mapGetters(["modalOpen"]),
  },
  methods: {
    ...mapMutations(["closeAllModals", "setDetailedBook"]),
    shutItDown() {
      this.closeAllModals();
      this.setDetailedBook({});
    },
  },
};
</script>

<style>
.page-modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 1;
}
.open .page-modal__overlay {
  visibility: visible;
  opacity: 0.2;
}
.page-modal__modal {
  width: 100%;
  height: 100%;
}
</style>
