<template>
  <div class="header-profile">
    <div class="header-profile__image" @click="toggleDropdown">
      <img v-if="userProfile?.image" :src="userProfile.image" alt="" />
      <div
        v-if="!userProfile?.image"
        class="header-profile__image-placeholder"
      ></div>
    </div>
    <div
      class="header-profile-dropdown dropdown-modal-menu flex-column"
      :class="{ open: headerDropdownOpen }"
    >
      <div class="d-flex flex-column p-1">
        <router-link to="/account" @click="toggleDropdown">Account</router-link>
        <hr class="my-1" />
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

<style scoped>
.header-profile__image {
  height: 35px;
  width: 35px;
  cursor: pointer;
}
.header-profile__image img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.header-profile__image-placeholder {
  height: 100%;
  width: 100%;
  background-color: var(--color-grey);
  border-radius: 50%;
}
.header-profile-dropdown {
  right: var(--spacing-size-1);
  top: 60px;
  height: 0;
  width: 150px;
}
.header-profile-dropdown.open {
  height: 117px;
}

@media (min-width: 768px) {
  .header-profile__image {
    height: 44px;
    width: 44px;
  }
  .header-profile-dropdown {
    top: 65px;
    right: var(--spacing-size-4);
  }
}
</style>
