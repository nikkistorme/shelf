<template>
  <div class="library-page">
    <section class="d-flex flex-column gap-2 w-100">
      <div class="library__shelf-top d-flex flex-column jc-between gap-2">
        <ShelfTitleDropdown />
        <div class="d-flex jc-between ai-center gap-2">
          <InputDefault
            class="w-100"
            v-model="searchTerm"
            placeholder="Search..."
          />
          <IconSort
            class="library__sort-icon cursor-pointer"
            @click="openShelfSortModal"
          />
        </div>
      </div>
      <div class="library__books">
        <BookShelved
          v-for="(book, i) in booksSortedAndFiltered"
          :key="i"
          :book="book"
          class="library__book"
          location="library"
        />
      </div>
    </section>
    <ModalShelfSort v-if="sortingShelf" />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useShelfStore } from "~~/store/ShelfStore";
import { useBookStore } from "~~/store/BookStore";
import { useModalStore } from "~~/store/ModalStore";
import {
  sortShelfByMethod,
  filterBooksBySearchTerm,
} from "~/services/sortService";

export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth", "shelves"],
    });

    const shelfStore = useShelfStore();
    const { activeShelf } = storeToRefs(shelfStore);

    const bookStore = useBookStore();
    const booksSortedAndFiltered = computed(() => {
      let books = bookStore.getUserBooksOnShelf(activeShelf.value);
      books.sort((a, b) => sortShelfByMethod(a, b, activeShelf.value));
      if (books?.length !== activeShelf.value.book_count) {
        activeShelf.value.book_count = books.length;
        shelfStore.setShelfProperties(activeShelf.value.id, {
          book_count: books.length,
        });
      }
      return filterBooksBySearchTerm(books, searchTerm.value);
    });

    const modalStore = useModalStore();
    const sortingShelf = ref(false);
    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        sortingShelf.value = false;
      }
    });

    function openShelfSortModal() {
      sortingShelf.value = true;
      modalStore.openModal();
    }

    const searchTerm = ref("");

    return {
      activeShelf,
      booksSortedAndFiltered,
      sortingShelf,
      openShelfSortModal,
      searchTerm,
    };
  },
};
</script>

<style>
.library__books {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-size-1);
}

.library__sort {
  position: relative;
  gap: var(--spacing-size-half);
  height: 30px;
}

.library__sort-icon {
  height: 25px;
  width: 25px;
}

.library__sort-select {
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
}

@media (min-width: 526px) {
  .library__books {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 695px) {
  .library__books {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1250px) {
  .library__books {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
