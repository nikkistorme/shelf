<template>
  <div>
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
  overflow: hidden;
  box-sizing: border-box;
  font-size: 10px;
}
body {
  margin: 0;
  background: #c0c0c0;
  font-family: "Cabin", sans-serif;
  font-size: 1.4rem;
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
  height: calc(100vh - 50px);
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
