<template>
  <div v-if="description" class="book-page__description">
    <p class="book-page__description-text">
      {{ description }}

      <ButtonInline
        v-if="truncateDescription"
        class="book-page__description-expand"
        :text="expandDescription ? 'show less' : 'show more'"
        underline
        color="blue"
        @click="toggleDescription"
      />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    book: Object,
  },
  setup(props) {
    const description = ref(props.book.description);
    const truncateDescription = ref(false);
    const expandDescription = ref(false);

    const checkDescription = (string) => {
      const newString = string;
      if (!expandDescription.value && newString?.length > 350) {
        truncateDescription.value = true;
        return `${newString.substring(0, 346).trim()}...`;
      } else return newString;
    };

    watch(expandDescription, () => {
      description.value = checkDescription(props.book.description);
    });

    description.value = checkDescription(props.book.description);

    const toggleDescription = () => {
      expandDescription.value = !expandDescription.value;
    };

    return {
      description,
      truncateDescription,
      expandDescription,
      toggleDescription,
    };
  },
};
</script>
