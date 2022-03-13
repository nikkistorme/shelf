<template>
  <main class="library__page">
    <ShelvesList class="library__sidebar" />
    <ShelfTitleDropdown />
    <div class="library__shelf-filters">
      <DefaultInput v-model="searchTerm" class="mb-1" placeholder="Search..." />
      <div v-if="activeShelf.sort" class="library__shelf-sort">
        <SelectInput
          v-if="activeShelf.sort"
          :id="`shelf-sort__${activeShelf.id}`"
          v-model="activeShelf.sort.method"
          class="library__shelf-sort-input"
          :options="sortOptions"
          align="right"
          no-carrot
          @change="changeSortMethod"
        />
        <!-- <div
          class="library__shelf-sort-direction d-flex jc-center ai-center"
          :class="{ ascending: !activeShelf.sort.descending }"
          @click="changeSortDirection"
        >
          <ArrowDown />
        </div> -->
      </div>
    </div>
    <div class="libary__books">
      <ShelvedBook
        v-for="(book, i) in booksOnActiveShelf"
        :key="i"
        :book="book"
        class="library__book"
        location="library"
      />
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import {
  getShelfSortOptions,
  sortShelfByMethod,
  filterBooksBySearchTerm,
} from "../services/shelfSortingService.js";

import DefaultInput from "../components/forms/DefaultInput.vue";
import ShelvesList from "../components/Library/ShelvesList.vue";
import ShelvedBook from "../components/ShelvedBook.vue";
import ShelfTitleDropdown from "../components/Library/ShelfTitleDropdown.vue";
import SelectInput from "../components/forms/SelectInput.vue";
import ArrowDown from "../components/icons/ArrowDown.vue";

export default {
  components: {
    DefaultInput,
    ShelvesList,
    ShelvedBook,
    ShelfTitleDropdown,
    SelectInput,
    ArrowDown,
  },
  data() {
    return {
      sortOptions: getShelfSortOptions(),
      searchTerm: "",
    };
  },
  computed: {
    ...mapGetters(["books", "shelves", "activeShelf", "getBooksOnShelf"]),
    sortedBooks() {
      const books = this.getBooksOnShelf(this.activeShelf);
      books.sort((a, b) => sortShelfByMethod(a, b, this.activeShelf));
      return books;
    },
    booksOnActiveShelf() {
      return filterBooksBySearchTerm(this.sortedBooks, this.searchTerm);
    },
  },
  methods: {
    ...mapActions(["updateShelfSort"]),
    async changeSortMethod() {
      await this.updateShelfSort(this.activeShelf);
    },
  },
};
</script>

<style>
.library__page {
  padding: var(--spacing-size-2) var(--spacing-size-1);
}
.libary__books {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-size-1);
}
.library__book {
  width: 100%;
}
.library__book:nth-child(odd) {
  justify-self: end;
}
.library__shelf-filters {
  margin-bottom: var(--spacing-size-2);
}
.library__shelf-sort {
  position: relative;
}
.library__shelf-sort-input select {
  text-align: left;
  direction: ltr;
}
.library__shelf-sort-direction {
  position: absolute;
  right: 0;
  height: 100%;
  width: 40px;
  cursor: pointer;
}
.library__shelf-sort-direction svg {
  height: 10px;
  width: 10px;
}
.library__shelf-sort-direction.ascending svg {
  transform: rotate(180deg);
}
</style>
