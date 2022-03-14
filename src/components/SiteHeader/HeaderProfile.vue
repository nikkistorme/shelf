<template>
  <div class="header-profile">
    <div class="header-profile__image" @click="toggleDropdown">
      <img :src="userProfile.image" alt="" />
    </div>
    <div
      class="header-profile-dropdown dropdown-modal-menu flex-column"
      :class="{ open: profileDropdownOpen }"
    >
      <div class="d-flex flex-column p-1">
        <router-link to="/account" @click="toggleDropdown">Account</router-link>
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
  components: {
    InlineButton,
  },
  computed: {
    ...mapGetters(["modalOpen", "userProfile", "profileDropdownOpen"]),
  },
  methods: {
    ...mapMutations(["toggleModal", "toggleProfileDropdown"]),
    test() {
      console.log(this.profileDropdownOpen);
    },
    toggleDropdown() {
      this.toggleModal();
      this.toggleProfileDropdown();
    },
    signOut() {
      this.toggleModal();
      this.toggleProfileDropdown();
      this.$store.dispatch("signOut");
    },
  },
};
</script>

<style scoped>
.header-profile__image {
  height: 35px;
  cursor: pointer;
}

@media (min-width: 768px) {
  .header-profile__image {
    height: 44px;
  }
}
.header-profile__image img {
  height: 100%;
  border-radius: 50%;
}

.header-profile-dropdown {
  right: var(--spacing-size-1);
  top: 60px;
  height: 0;
  width: 150px;
}

@media (min-width: 768px) {
  .header-profile-dropdown {
    top: 65px;
    right: var(--spacing-size-4);
  }
}

.header-profile-dropdown.open {
  height: 117px;
}
</style>
