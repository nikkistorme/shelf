<template>
  <p class="book-page__publishing">
    |
    <span v-if="props.book.published">{{ publishedDate }} by </span
    >{{ publisher }}
  </p>
</template>

<script>
import { formatDate } from "~/services/timeService";

export default {
  props: {
    book: Object,
  },
  setup(props) {
    const publishedDate = ref(formatDate(props.book.published));
    const publisher = ref(props.book.publisher);

    return {
      publishedDate,
      publisher,
      props,
    };
  },
};
</script>

<style>
.book-page__publishing {
  font-size: var(--font-size-small);
}
</style>
