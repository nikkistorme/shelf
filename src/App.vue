<template>
  <div class="content">
    <Drawer />
    <img class="header_img" src="./assets/shelf-header-1.png" alt="shelf" />
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Drawer from "./components/drawer/Drawer.vue";

export default {
  components: {
    Header,
    Drawer
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import "./assets/styles/circle.css";
@import "./assets/styles/fonts.scss";
@import "./assets/styles/forms.scss";
@import "./assets/styles/buttons.scss";
* {
  box-sizing: border-box;
  -webkit-appearance: none;
}
html {
  height: -webkit-fill-available;
  font-size: 10px;
}
body {
  height: 100vh;
  margin: 0;
  font-size: 1.6rem;
  font-family: Arial, Helvetica, sans-serif;
}
.content {
  position: relative;
  overflow-x: hidden;
  height: 100%;
  .header_img {
    position: absolute;
    z-index: -1;
    height: 20vh;
  }
}
main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.full_width {
  width: 100%;
}
</style>
