<template>
  <NuxtLink to="/home" class="header-logo">
    <img src="~/assets/img/logo.svg" alt="a row of colorful books" />
  </NuxtLink>
</template>

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
