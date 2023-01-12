<template>
  <div v-if="props.book.description" class="book-page__description">
    <p
      class="book-page__description-text"
      :class="{ expanded: expandDescription }"
    >
      {{ props.book.description }}
    </p>
    <ButtonInline
      class="book-page__description-expand"
      :text="expandDescription ? 'Show less' : 'Show more'"
      underline
      color="blue"
      @click="toggleDescription"
    />
  </div>
</template>

<script>
export default {
  props: {
    book: Object,
  },
  setup(props) {
    const expandDescription = ref(false);

    function toggleDescription() {
      expandDescription.value = !expandDescription.value;
    }

    return {
      props,
      expandDescription,
      toggleDescription,
    };
  },
};
</script>

<style>
.book-page__description-text {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-page__description-text:not(.expanded) {
  -webkit-line-clamp: 5;
}
.book-page__description-expand {
}
</style>
