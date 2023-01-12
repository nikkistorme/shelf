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

    let totalPages = ref(book.value.total_pages);
    if (userBook?.value?.total_pages)
      totalPages.value = userBook.value.total_pages;

    return {
      totalPages,
    };
  },
};
</script>
