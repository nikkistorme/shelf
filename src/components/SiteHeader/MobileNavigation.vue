<template>
  <div class="mobile-navigation h-100">
    <div
      class="mobile-navigation__hamburger d-flex flex-column jc-center cursor-pointer"
      @click="toggleDropdown"
    >
      <div></div>
      <div></div>
    </div>
    <div
      class="mobile-navigation__dropdown dropdown-modal-menu flex-column"
      :class="{ open: headerDropdownOpen }"
    >
      <div class="d-flex flex-column gap-1 p-1">
        <router-link to="/home" @click="toggleDropdown">Home</router-link>
        <router-link to="/library" @click="toggleDropdown">Library</router-link>
        <router-link to="/account" @click="toggleDropdown">Account</router-link>
        <a href="https://trello.com/b/HG9elwZ0/roadmap" target="_blank">
          Roadmap
        </a>
        <hr />
        <InlineButton text="Sign out" :click-action="signOut" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import InlineButton from "../buttons/InlineButton.vue";

export default {
  components: { InlineButton },
  computed: {
    ...mapGetters(["modalOpen", "userProfile", "headerDropdownOpen"]),
  },
  methods: {
    ...mapMutations(["toggleModal", "toggleheaderDropdown"]),
    test() {
      console.log(this.headerDropdownOpen);
    },
    toggleDropdown() {
      this.toggleModal();
      this.toggleheaderDropdown();
    },
    signOut() {
      this.toggleModal();
      this.toggleheaderDropdown();
      this.$store.dispatch("signOut");
    },
  },
};
</script>

<style>
.mobile-navigation {
  position: relative;
}
.mobile-navigation__hamburger {
  gap: 5px;
  height: 35px;
}
.mobile-navigation__hamburger > * {
  height: 3px;
  width: 25px;
  border-radius: var(--border-radius-1);
  background-color: black;
}
.mobile-navigation__dropdown {
  right: 0;
  top: 35px;
  height: 0;
  width: 200px;
}
.mobile-navigation__dropdown.open {
  height: 230px;
}
.mobile-navigation__dropdown a {
  text-decoration: none;
  color: var(--color-black);
}
</style>
