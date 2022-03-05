<template>
  <form class="header-search" action="">
    <DefaultInput class="w-100" type="text" />
    <!-- <input class="header-search-input input" type="text" /> -->
  </form>
</template>

<script>
export default {};
</script>

<style scoped>
.header-search {
  margin-right: var(--spacing-root);
}

@media (min-width: 768px) {
  .header-search {
    margin-right: var(--spacing-size-4);
  }
}
</style>
