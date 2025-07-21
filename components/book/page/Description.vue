<template>
  <div v-if="displayDescription" class="book-page__description">
    <p class="book-page__description-text">
      {{ displayDescription }}

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

<script setup lang="ts">
const props = defineProps<{
  description: string;
}>();

const displayDescription = ref(props.description);
const truncateDescription = ref(false);
const expandDescription = ref(false);

const checkDescription = (string: string): string => {
  const newString: string = string;
  if (!expandDescription.value && newString?.length > 350) {
    truncateDescription.value = true;
    return `${newString.substring(0, 346).trim()}...`;
  } else return newString;
};

watch(expandDescription, () => {
  displayDescription.value = checkDescription(props.description);
});

displayDescription.value = checkDescription(props.description);

const toggleDescription = (): void => {
  expandDescription.value = !expandDescription.value;
};
</script>
