<template>
  <div class="library__shelf-select-container">
    <div
      class="library__shelf-select d-flex ai-center"
      @click="toggleShelfSelect"
    >
      <div
        class="library__choose-shelf-icon d-flex flex-column jc-space-around mr-1"
      >
        <ArrowDown class="up" />
        <ArrowDown class="down" />
      </div>
      <h2 class="library__shelf-name">{{ activeShelf.name }}</h2>
    </div>
    <div
      class="library__shelf-select-dropdown flex-column"
      :class="{ open: libraryShelfSelectOpen }"
    >
      <div class="p-1 mt-1">
        <ul class="px-1">
          <li
            v-for="(shelf, i) in sortedShelves"
            :key="i"
            class="d-flex jc-space-between mb-1"
          >
            <p
              v-if="shelf.id === activeShelf.id"
              class="shelf-title-dropdown__active-shelf-name"
            >
              {{ shelf.name }}
            </p>
            <InlineButton
              v-else
              :text="shelf.name"
              color="blue"
              @click="changeActiveShelf(shelf)"
            />
            <div>
              <p>({{ howManyBooksOnShelf(shelf) }})</p>
            </div>
          </li>
        </ul>
        <hr class="my-2" />
        <DefaultButton text="Create shelf" flavor="tiny" class="mb-1" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import ArrowDown from "../icons/ArrowDown.vue";
import InlineButton from "../buttons/InlineButton.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
export default {
  components: { ArrowDown, InlineButton, DefaultButton },
  computed: {
    ...mapGetters([
      "books",
      "shelves",
      "libraryShelfSelectOpen",
      "activeShelf",
    ]),
    sortedShelves() {
      const allBooksShelf = this.shelves.find((shelf) => shelf.allBooksShelf);
      const finishedShelf = this.shelves.find((shelf) => shelf.finishedShelf);
      const inProgressShelf = this.shelves.find(
        (shelf) => shelf.inProgressShelf
      );
      const shelves = this.shelves.filter(
        (shelf) =>
          !shelf.allBooksShelf && !shelf.finishedShelf && !shelf.inProgressShelf
      );
      if (inProgressShelf) shelves.unshift(inProgressShelf);
      if (finishedShelf) shelves.unshift(finishedShelf);
      if (allBooksShelf) shelves.unshift(allBooksShelf);
      return shelves;
    },
  },
  methods: {
    ...mapMutations([
      "toggleModal",
      "toggleLibraryShelfSelectOpen",
      "setActiveShelf",
    ]),
    toggleShelfSelect() {
      this.toggleModal();
      this.toggleLibraryShelfSelectOpen();
    },
    howManyBooksOnShelf(shelf) {
      if (shelf.allBooksShelf) {
        return this.books.length;
      } else if (shelf.finishedShelf) {
        return this.books.filter((book) => book.finished).length;
      } else if (shelf.inProgressShelf) {
        return this.books.filter((book) => book.inProgress).length;
      } else {
        return this.books.filter((book) => book.shelves.includes(shelf.id))
          .length;
      }
    },
    changeActiveShelf(shelf) {
      this.setActiveShelf(shelf);
      this.toggleModal();
      this.toggleLibraryShelfSelectOpen();
    },
  },
};
</script>

<style>
.library__shelf-select-container {
  position: relative;
}
.library__shelf-select {
  width: fit-content;
  margin-bottom: var(--spacing-size-2);
  cursor: pointer;
}
.library__choose-shelf-icon .up,
.library__choose-shelf-icon .down {
  width: var(--spacing-size-1);
  height: var(--spacing-size-1);
}
.library__choose-shelf-icon .up {
  transform: rotate(180deg);
}
.library__shelf-filters {
  margin-bottom: var(--spacing-size-2);
}
.library__shelf-select-dropdown {
  position: absolute;
  left: var(--spacing-size-1);
  top: 40px;
  display: flex;
  max-height: 0;
  width: 240px;
  border-radius: var(--border-radius-2);
  background-color: white;
  box-shadow: var(--box-shadow-1);
  visibility: hidden;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  z-index: 2;
}
.library__shelf-select-dropdown.open {
  display: flex;
  visibility: visible;
  max-height: 400px;
}
.shelf-title-dropdown__active-shelf-name {
  font-weight: bold;
  text-decoration: underline;
}
</style>
