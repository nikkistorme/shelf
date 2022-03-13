<template>
  <main class="library__page">
    <ShelvesList class="library__sidebar" />
    <ShelfTitleDropdown />
    <div class="library__shelf-filters d-flex">
      <DefaultInput placeholder="Search..." />
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

import DefaultInput from "../components/forms/DefaultInput.vue";
import ShelvesList from "../components/Library/ShelvesList.vue";
import ShelvedBook from "../components/ShelvedBook.vue";
import ShelfTitleDropdown from "../components/Library/ShelfTitleDropdown.vue";

export default {
  components: {
    DefaultInput,
    ShelvesList,
    ShelvedBook,
    ShelfTitleDropdown,
  },
  computed: {
    ...mapGetters(["books", "shelves", "activeShelf"]),
    booksOnActiveShelf() {
      if (this.activeShelf.allBooksShelf) {
        return this.books;
      } else if (this.activeShelf.finishedShelf) {
        return this.books.filter((book) => book.finished);
      } else if (this.activeShelf.inProgressShelf) {
        return this.books.filter((book) => book.inProgress);
      } else {
        return this.books.filter((book) =>
          book.shelves.includes(this.activeShelf.id)
        );
      }
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
</style>
