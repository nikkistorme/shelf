<template>
  <p class="book-page__author">{{ author }}</p>
</template>

<script setup lang="ts">
defineProps<{
  author: string;
}>();
</script>

<style>
.book-page__author {
  text-align: center;
}
@media (min-width: 768px) {
  .book-page__author {
    text-align: left;
    font-size: var(--font-size-2);
  }
}
</style>
