<template>
  <p class="book-page__author">{{ props.book.author }}</p>
</template>

<script>
export default {
  props: {
    book: Object,
  },
  setup(props) {
    return {
      props,
    };
  },
};
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
