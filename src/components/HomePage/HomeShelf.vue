<template>
  <div class="home-shelf d-flex flex-column jc-end w-100">
    <div class="home-shelf__books d-flex jc-start w-100">
      <ShelvedBook
        v-for="(book, i) in booksOnThisShelf"
        :key="i"
        :book="book"
      />
    </div>
    <div class="home-shelf__floor d-flex jc-space-between w-100">
      <h5 class="home-shelf__name" @click="test">{{ shelf.name }}</h5>
      <div v-if="shelf.sort" class="home-shelf__sort d-flex al-center">
        <select
          :id="`shelf-sort__${shelf.id}`"
          v-model="shelf.sort.method"
          :name="`shelf-sort__${shelf.id}`"
          class="home-shelf__sort-method"
          align="right"
        >
          <option value="date-added-to-library">Date Added</option>
          <option value="date-started">Date Started</option>
          <option value="percent-complete">Progress</option>
          <option value="last-updated-progress">Last Updated Progress</option>
          <option value="date-added-to-shelf">Date Added to Shelf</option>
        </select>
        <ArrowDown
          class="home-shelf__sort-direction"
          :class="{ ascending: !shelf.sort.descending }"
          @click="changeSortDirection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ShelvedBook from "../ShelvedBook.vue";
import ArrowDown from "../icons/ArrowDown.vue";

import sortOptions from "../../services/shelfSortingService.js";

export default {
  components: { ShelvedBook, ArrowDown },
  props: {
    shelfId: { type: String, default: "" },
  },
  emits: ["update:shelf"],
  computed: {
    ...mapGetters(["books", "getShelfById"]),
    shelf() {
      return this.getShelfById(this.shelfId);
    },
    booksOnThisShelf() {
      if (this?.shelf?.id && this.books.length) {
        let books = this.books.filter((book) =>
          book.shelves.includes(this.shelf.id)
        );
        books.sort((a, b) => sortOptions.selectedSortMethod(a, b, this.shelf));
        return books;
      } else {
        return [];
      }
    },
  },
  methods: {
    test() {
      console.log(this.shelf);
    },
    changeSortMethod() {
      this.$store.dispatch("updateShelfSort", this.shelf);
    },
    async changeSortDirection() {
      this.shelf.sort.descending = !this.shelf.sort.descending;
      await this.$store.dispatch("updateShelfSort", this.shelf);
    },
  },
};
</script>

<style>
@media (min-width: 768px) and (max-width: 1023px) {
  .home-shelf {
    grid-column: 1 / -1;
  }
}
.home-shelf__books {
  padding: calc(var(--spacing-size-1) / 4);
  overflow-x: auto;
  overflow-y: hidden;
}
.home-shelf__floor {
  padding: calc(var(--spacing-size-1) / 4) var(--spacing-size-1);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.16);
}
.home-shelf__sort-method {
  margin-right: 5px;
  border: none;
  background: none;
  text-align: right;
}
.home-shelf__sort-direction {
  height: 100%;
  cursor: pointer;
}
.home-shelf__sort-direction.ascending {
  transform: rotate(180deg);
}
</style>
