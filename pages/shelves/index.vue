<template>
  <div class="library-page page-wrapper">
    <section class="d-flex flex-column gap-2 w-100">
      <div class="library__shelf-top d-flex gap-2">
        <ShelfTitleDropdown />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth", "shelves"],
    });

    return {};
  },
};
</script>
