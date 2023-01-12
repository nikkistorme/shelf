<template>
  <div class="book-finder-page page-wrapper"></div>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth", "book"],
    });
  },
};
</script>
