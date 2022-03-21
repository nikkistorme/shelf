<template>
  <nav class="header-nav d-flex ai-center mr-2">
    <ul class="nav-list d-flex gap-1">
      <li class="nav-list-item"><router-link to="/home">Home</router-link></li>
      <li class="nav-list-item">
        <router-link to="/library">Library</router-link>
      </li>
      <li class="nav-list-item">
        <!-- <router-link to="social">Social</router-link> -->
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
.nav-list-item a {
  text-decoration: none;
}
</style>
