<template>
  <div v-if="bookToAdd.title" class="search-result">
    <!-- CLOSE BUTTON -->
    <div
      class="book-details__close d-flex jc-center ai-center"
      @click="closeBookToAdd"
    >
      <CloseIcon />
    </div>
    <!-- CLOSE BUTTON -->
    <!-- COVER -->
    <div
      class="book-details__cover-container d-flex flex-column ai-center w-100"
    >
      <div class="book-details__cover d-flex jc-center mb-2" @click="logBook">
        <img :src="bookToAdd.image" :alt="bookToAdd.title" />
      </div>
    </div>
    <!-- COVER -->
    <!-- TOP INFO -->
    <div class="book-details__top-info d-flex flex-column jc-center mb-1">
      <h2 class="book-details__title mb-1">{{ bookToAdd.title }}</h2>
      <h3 class="book-details__author">by {{ bookToAdd.author }}</h3>
      <p class="book-details__pages">{{ bookToAdd.totalPages }} pages</p>
      <DefaultButton
        text="Add book to library"
        color="blue"
        underline
        class="mt-1"
        @click="addBook"
      />
    </div>
    <!-- TOP INFO -->
    <div class="search-result__add-button"></div>
    <!-- DESCRIPTION -->
    <div class="book-details__description card">
      <p
        class="book-details__description-text"
        :class="{ expanded: expandDescription }"
      >
        {{ bookToAdd.description }}
      </p>
      <InlineButton
        class="book-details__description-expand"
        :text="expandDescription ? 'show less' : 'show more'"
        underline
        color="blue"
        @click="toggleDescription"
      />
    </div>
    <!-- DESCRIPTION -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import CloseIcon from "./icons/CloseIcon.vue";
import InlineButton from "./buttons/InlineButton.vue";
import DefaultButton from "./buttons/DefaultButton.vue";

export default {
  components: { CloseIcon, InlineButton, DefaultButton },
  data() {
    return {
      expandDescription: false,
    };
  },

  computed: {
    ...mapGetters(["bookToAdd"]),
  },
  methods: {
    ...mapMutations(["closeAllModals", "setBookToAdd"]),
    ...mapActions(["addBookToLibrary"]),
    logBook() {
      console.log(`${this.bookToAdd.title}:`, this.bookToAdd);
    },
    closeBookToAdd() {
      this.closeAllModals();
      this.setBookToAdd({});
    },
    toggleDescription() {
      this.expandDescription = !this.expandDescription;
    },
    async addBook() {
      console.log(this.bookToAdd);
      await this.addBookToLibrary(this.bookToAdd);
      // this.setDetailedBook();
      // this.closeBookToAdd();
    },
  },
};
</script>

<style>
.search-result {
  position: fixed;
  top: 50%;
  left: 50%;
  display: grid;
  grid-auto-rows: min-content;
  height: calc(100vh - (var(--spacing-size-1) * 2));
  width: calc(100vw - (var(--spacing-size-1) * 2));
  padding: var(--spacing-size-3) var(--spacing-size-1);
  margin-top: calc(-1 * (100vh - (var(--spacing-size-1) * 2)) / 2);
  margin-left: calc(-1 * (100vw - (var(--spacing-size-1) * 2)) / 2);
  background-color: white;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-1);
  z-index: 2;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
