<template>
  <div class="nav-and-main-container">
    <Nav />
    <div :class="[{ nav_open: showNav }]" class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Nav from "./components/Nav.vue";

export default {
  components: {
    Nav
  },
  computed: {
    ...mapGetters(["showNav"])
  },
  methods: {}
};
</script>

<style lang="scss">
html {
  height: -webkit-fill-available;
  box-sizing: border-box;
  font-size: 10px;
}
body {
  height: 100vh;
  height: -webkit-fill-available;
  margin: 0;
  font-family: "Cabin", sans-serif;
  font-size: 1.4rem;
  background: #c0c0c0;
  overflow: hidden;
}
h1,
h2,
h3,
h4 {
  font-family: "Roboto", sans-serif;
  margin: 0;
}
p {
  margin: 0;
}
.main-container {
  transition: margin-left 0.5s;
  height: 91vh;
  height: -webkit-calc(100vh - 75px);
  height: -moz-calc(100vh - 75px);
  height: calc(100vh - 75px);
  overflow: auto;
  @media (min-width: 768px) {
    margin-left: 50px;
    height: 100vh;
  }
  .section-with-margin {
    padding: 15px;
    @media (min-width: 768px) {
      padding: 50px;
    }
  }
}
.nav_open {
  margin-left: 250px;
}
</style>
