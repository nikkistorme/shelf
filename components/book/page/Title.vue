<template>
  <h1 class="book-page__title">{{ book?.title ? book.title : "" }}</h1>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";

const bookStore = useBookStore();
const { book } = storeToRefs(bookStore);
</script>

<style>
.book-page__title {
  text-align: center;
  font-size: var(--font-size-2);
}

@media (min-width: 768px) {
  .book-page__title {
    font-size: var(--font-size-3);
    text-align: left;
  }
}
</style>
