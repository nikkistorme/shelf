<template>
  <p class="book-page__publishing">
    |
    <span v-if="props.book.published">{{ publishedDate }} by </span
    >{{ publisher }}
  </p>
</template>

<script setup lang="ts">
import { formatDate } from "~/services/timeService";

const props = defineProps<{
  book: BookEdition;
}>();

const publishedDate = ref(formatDate(props.book.published));
const publisher = ref(props.book.publisher);
</script>

<style>
.book-page__publishing {
  font-size: var(--font-size-small);
}
</style>
