<template>
  <p>{{ totalPages }} pages</p>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";

export default {
  setup() {
    const bookStore = useBookStore();
    const { book, userBook } = storeToRefs(bookStore);

    const totalPages = computed(() => {
      if (userBook.value?.total_pages) return userBook.value.total_pages;
      return book.value.total_pages;
    });

    return {
      totalPages,
    };
  },
};
</script>
