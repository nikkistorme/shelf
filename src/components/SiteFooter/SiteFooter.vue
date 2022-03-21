<template>
  <footer class="site-footer d-flex mb-3">
    <p>
      <router-link to="/home">Home</router-link>
      |
      <router-link to="/library">Library</router-link>
      |
      <router-link to="/account">Account</router-link>
      |
      <a href="https://trello.com/b/HG9elwZ0/roadmap" target="_blank"
        >Roadmap</a
      >
    </p>
  </footer>
</template>

<script>
export default {};
</script>

<style>
.site-footer {
  padding: 0 var(--spacing-root);
}
@media (min-width: 768px) {
  .site-footer {
    padding: 0 var(--spacing-size-4);
  }
}
</style>
