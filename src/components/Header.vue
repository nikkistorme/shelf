<template>
  <header>
    <div class="hamburger-circle" v-if="userProfile.name">
      <div class="hamburger" @click="openNav">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <h1>Shelf</h1>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["userProfile"])
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    openNav() {
      const newDrawer = {
        type: "nav"
      };
      this.$store.commit("setDrawer", newDrawer);
    }
  }
};
</script>

<style lang="scss">
header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  h1 {
    margin-left: 5rem;
  }
}
.hamburger-circle {
  position: fixed;
  left: 1rem;
  background-color: #fff;
  box-shadow: #000 0 0 20px -6px;
  border-radius: 50%;
  z-index: 1;
  height: 50px;
  width: 50px;
  transition: 0.25s;
  .hamburger {
    cursor: pointer;
    position: absolute;
    z-index: 3;
    top: 13px;
    right: 14px;
    div {
      width: 21px;
      height: 2px;
      background-color: #000;
      margin: 4px 0;
      transition: 0.4s;
    }
  }
}
// .expanded {
//   top: -150px;
//   right: -160px;
//   width: 400px;
//   height: 400px;
//   nav {
//     transition-delay: 0.25s;
//     display: initial;
//     opacity: 1;
//     pointer-events: initial;
//   }
// }
// nav {
//   position: absolute;
//   pointer-events: none;
//   width: 100%;
//   bottom: 25%;
//   left: 10%;
//   opacity: 0;
//   transition: opacity 0.1s;
//   a {
//     font-size: 30px;
//     color: #818181;
//     margin: 10px;
//     &.router-link-exact-active {
//       color: black;
//     }
//   }
// }
</style>
