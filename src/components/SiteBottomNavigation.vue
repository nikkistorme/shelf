<template>
  <div class="site-bottom-nav d-flex al-center">
    <nav class="w-100">
      <ul class="d-flex jc-space-around">
        <li class="nav-list-item">
          <router-link to="/home"
            ><img src="../assets/Home.svg" alt="home page"
          /></router-link>
        </li>
        <li class="nav-list-item">
          <router-link to="/library"
            ><img src="../assets/Library.svg" alt="library page"
          /></router-link>
        </li>
        <li class="nav-list-item">
          <router-link to="/social"
            ><img src="../assets/Social.svg" alt="social page"
          /></router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.site-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  width: 100%;
  padding: 0 var(--spacing-root);
  box-shadow: var(--box-shadow-2);
  background-color: white;
}

@media (min-width: 768px) {
  .site-bottom-nav {
    display: none;
    visibility: hidden;
  }
}

.nav-list-item {
  height: 35px;
  width: 35px;
}

.nav-list-item img {
  height: 100%;
  width: 100%;
}
</style>
