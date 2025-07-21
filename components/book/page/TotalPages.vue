<template>
  <p>{{ totalPages }} pages</p>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";

const bookStore = useBookStore();
const { book, userBook } = storeToRefs(bookStore);

const totalPages = computed((): UserBook["total_pages"] | null => {
  if (userBook?.value?.total_pages) return userBook.value.total_pages;
  else if (book?.value?.total_pages) return book.value.total_pages;
  else return null;
});
</script>
