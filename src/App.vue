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
import Drawer from "./components/Drawer.vue";

export default {
  components: {
    Header,
    Drawer
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html {
  height: -webkit-fill-available;
  font-size: 10px;
}
body {
  height: 100vh;
  margin: 0;
  font-size: 1.6rem;
}
h1,
h2,
h3,
h4 {
  margin: 0;
  font-family: 'Alegreya', serif;
}
h1 {
  font-size: 4rem;
}
.content {
  position: relative;
  overflow: hidden;
  height: 100%;
  .header_img {
    position: absolute;
    z-index: -1;
  }
}
main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
