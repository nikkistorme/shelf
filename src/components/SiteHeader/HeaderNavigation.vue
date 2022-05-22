<template>
  <nav class="header-nav d-flex ai-center mr-2">
    <ul class="nav-list d-flex gap-1">
      <li class="nav-list-item"><router-link to="/home">Home</router-link></li>
      <li class="nav-list-item">
        <router-link to="/library">Library</router-link>
      </li>
      <li class="nav-list-item">
        <a href="https://trello.com/b/HG9elwZ0/roadmap" target="_blank">
          Roadmap
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style>
@media (max-width: 767px) {
  .header-nav {
    display: none;
    visibility: none;
  }
}
.nav-list-item a {
  text-decoration: none;
  color: var(--color-black);
}
</style>
