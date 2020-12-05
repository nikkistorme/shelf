<template>
  <div class="nav-container">
    <div class="sidenav-container">
      <div class="sidenav-tease">
        <button @click="openNav">>></button>
      </div>
      <div class="sidenav" :class="{ open: showNav, close: !showNav }">
        <nav>
          <a href="javascript:void(0)" class="closebtn" @click="openNav"
            >&times;</a
          >
          <router-link to="/home">Home</router-link>
          <router-link to="/shelves">Shelves</router-link>
          <router-link to="/add-book">Add a Book</router-link>
          <router-link to="/account">Account</router-link>
        </nav>
      </div>
    </div>
    <div class="bottom-nav">
      <nav class="bottom-nav-nav">
        <router-link to="/home">
          <font-awesome-icon icon="home" class="home-icon" />
        </router-link>
        <router-link to="/shelves">
          <font-awesome-icon icon="book" class="book-icon" />
        </router-link>
        <router-link to="/add-book">
          <font-awesome-icon icon="search" class="search-icon" />
        </router-link>
        <router-link to="/account">
          <font-awesome-icon icon="user" class="user-icon" />
        </router-link>
      </nav>
    </div>
  </div>
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
};
</script>

<style lang="scss">
.nav-container {
  height: 50px;
  @media (min-width: 768px) {
    height: 0px;
  }
}
.sidenav-container {
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
}
.sidenav-tease {
  height: 100%;
  width: 50px;
  position: fixed;
  background-color: #111;
}
.sidenav {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #111; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  a {
    white-space: nowrap;
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
    &:hover {
      color: #f1f1f1;
    }
  }
  .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }
  &.open {
    width: 250px;
  }
  &.close {
    width: 0;
  }
}
.bottom-nav {
  /* position: fixed; */
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: black;
  @media (min-width: 768px) {
    display: none;
  }
}
.bottom-nav-nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  a {
    font-size: 25px;
    color: #818181;
  }
}
a.router-link-exact-active {
  color: white;
}
</style>
