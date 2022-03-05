<template>
  <nav class="header-nav d-flex al-center mr-4">
    <ul class="nav-list d-flex">
      <li class="nav-list-item"><router-link to="/home">Home</router-link></li>
      <li class="nav-list-item">
        <router-link to="/library">Library</router-link>
      </li>
      <li class="nav-list-item">
        <router-link to="social">Social</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
@media (max-width: 767px) {
  .header-nav {
    display: none;
    visibility: none;
  }
}
.nav-list-item {
  margin: 0 var(--spacing-root);
}

.nav-list-item a {
  text-decoration: none;
}
.nav-list-item:first-child {
  margin-left: 0;
}
.nav-list-item:last-child {
  margin-right: 0;
}
</style>
