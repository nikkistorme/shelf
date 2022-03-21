<template>
  <router-link to="/" class="header-logo">
    <img src="../../assets/logo.svg" alt="" />
  </router-link>
</template>

<script>
export default {};
</script>

<style scoped>
.header-logo {
  height: 30px;
  margin-right: var(--spacing-root);
}
@media (min-width: 768px) {
  .header-logo {
    height: 44px;
    margin-right: var(--spacing-size-3);
  }
}
.header-logo img {
  height: 100%;
}
</style>
