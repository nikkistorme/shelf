<template>
  <header>
    <h1>Shelf</h1>
    <div class="hamburger-circle" :class="{ expanded: showNav }">
      <div class="hamburger" @click="changeNav">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav>
        <router-link class="link1" to="/home">
          <font-awesome-icon icon="home" class="home-icon" />
        </router-link>
        <router-link to="/shelves">
          <font-awesome-icon icon="book" class="book-icon" />
        </router-link>
        <router-link to="/add-book">
          <font-awesome-icon icon="book-medical" class="search-icon" />
        </router-link>
        <router-link to="/account">
          <font-awesome-icon icon="user" class="user-icon" />
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["showNav"])
  },
  methods: {
    ...mapMutations(["changeNav"]),
    openNav() {
      this.$store.commit("changeNav");
    }
  }
}
</script>

<style lang="scss">
header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
}
.hamburger-circle {
  position: fixed;
  right: 5px;
  top: 5px;
  background-color: #fff;
  box-shadow: #000 0 0 20px -6px;
  border-radius: 50%;
  z-index: 1;
  height: 50px;
  width: 50px;
  transition: 0.25s;
  .hamburger {
    cursor: pointer;
    position: fixed;
    z-index: 3;
    top: 19px;
    right: 19px;
    div {
      width: 21px;
      height: 2px;
      background-color: #000;
      margin: 4px 0;
      transition: 0.4s;
    }
  }
}
.expanded {
  top: -150px;
  right: -160px;
  width: 400px;
  height: 400px;
  nav {
    transition-delay: 0.25s;
    display: initial;
    opacity: 1;
    pointer-events: initial;
  }
}
nav {
  position: absolute;
  pointer-events: none;
  width: 100%;
  bottom: 25%;
  left: 10%;
  opacity: 0;
  transition: opacity 0.1s;
  a {
    font-size: 30px;
    color: #818181;
    margin: 10px;
    &.router-link-exact-active {
      color: black;
    }
  }
}
</style>
