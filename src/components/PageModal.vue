<template>
  <div class="page-modal" :class="{ open: showOverlay }">
    <div class="page-modal__overlay" @click="shutItDown"></div>
    <BookDetails v-if="detailedBook.title" />
    <ConfirmModal v-if="confirmAction.message" />
    <div
      v-show="showLoader"
      class="page-modal__loading d-flex jc-center ai-center"
    >
      <div class="page-modal__loading-backdrop"></div>
      <BookLoader class="page-modal__loading-icon" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import BookDetails from "./BookDetails/BookDetails.vue";
import ConfirmModal from "./ConfirmModal.vue";
import BookLoader from "./icons/BookLoader.vue";

export default {
  components: { BookDetails, ConfirmModal, BookLoader },
  computed: {
    ...mapGetters([
      "modalOpen",
      "detailedBook",
      "searchResultsOpen",
      "confirmAction",
      "shelvesLoading",
      "userLoading",
      "booksLoading",
    ]),
    showOverlay() {
      return (
        this.modalOpen ||
        this.detailedBook.title ||
        this.searchResultsOpen ||
        this.confirmAction.message
      );
    },
    showLoader() {
      return this.shelvesLoading || this.userLoading || this.booksLoading;
    },
  },
  methods: {
    ...mapMutations(["closeAllModals", "setDetailedBook", "setConfirmAction"]),
    shutItDown() {
      this.closeAllModals();
      this.setDetailedBook({});
      this.setConfirmAction({});
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
.page-modal__loading {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 10;
}
.page-modal__loading-backdrop {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.2;
}
.page-modal__loading-icon {
  z-index: 11;
}
</style>
