<template>
  <main class="library__page page-wrapper as-center">
    <div v-if="!shelvesLoading" class="library__wrapper d-flex gap-3 w-100">
      <LibrarySidebar class="library__sidebar" />
      <section class="d-flex flex-column gap-2 w-100">
        <div class="library__shelf-top d-flex gap-2">
          <ShelfTitleDropdown />
          <div class="library__shelf-filters d-flex gap-1">
            <DefaultInput v-model="searchTerm" placeholder="Search..." />
            <div v-if="activeShelf?.sort" class="library__shelf-sort">
              <SelectInput
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
      </section>
    </div>
    <div v-else class="d-flex jc-center ai-center" @click="test">
      <h2>Loading library...</h2>
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
import LibrarySidebar from "../components/Library/LibrarySidebar.vue";
import ShelvedBook from "../components/ShelvedBook.vue";
import ShelfTitleDropdown from "../components/Library/ShelfTitleDropdown.vue";
import SelectInput from "../components/forms/SelectInput.vue";

export default {
  components: {
    DefaultInput,
    LibrarySidebar,
    ShelvedBook,
    ShelfTitleDropdown,
    SelectInput,
  },
  data() {
    return {
      sortOptions: getShelfSortOptions(),
      searchTerm: "",
    };
  },
  computed: {
    ...mapGetters([
      "shelvesLoading",
      "books",
      "shelves",
      "activeShelf",
      "getBooksOnShelf",
    ]),
    sortedBooks() {
      let books = this.getBooksOnShelf(this.activeShelf);
      books.sort((a, b) => sortShelfByMethod(a, b, this.activeShelf));
      // books = books.filter((b) =>
      //   b.changes?.find((c) => c.action === "addBook")
      // );
      return books;
    },
    booksOnActiveShelf() {
      return filterBooksBySearchTerm(this.sortedBooks, this.searchTerm);
    },
  },
  watch: {
    shelvesLoading(newVal) {
      console.log("🚀 ~ newVal", newVal);
    },
  },
  methods: {
    ...mapActions(["updateShelfSort"]),
    test() {
      console.log("🚀 ~ shelvesLoading", this.shelvesLoading);
    },
    async changeSortMethod() {
      console.log("🚀 ~ this.activeShelf", this.activeShelf);
      await this.updateShelfSort(this.activeShelf);
    },
  },
};
</script>

<style>
/* .library__page {
  max-width: 1420px;
  padding: var(--spacing-size-2) var(--spacing-size-1);
} */
.library__shelf-top {
  flex-direction: column;
}
.library__shelf-filters {
  flex-direction: column;
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
@media (max-width: 899px) {
  .library__sidebar {
    display: none !important;
  }
}
@media (min-width: 526px) {
  .libary__books {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (min-width: 600px) {
  .library__shelf-filters {
    flex-direction: row;
  }
}
@media (min-width: 695px) {
  .libary__books {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
/* @media (min-width: 768px) {
  .library__page {
    padding: var(--spacing-size-3) var(--spacing-size-4);
  }
} */
@media (min-width: 900px) {
  .libary__books {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (min-width: 1081px) {
  .libary__books {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
@media (min-width: 1250px) {
  .library__shelf-top {
    flex-direction: row;
    justify-content: space-between;
  }
  .libary__books {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
