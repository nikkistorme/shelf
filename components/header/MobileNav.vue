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
      :class="{ open: showDropdown }"
    >
      <div class="d-flex flex-column gap-1 p-1">
        <NuxtLink to="/home" @click="toggleDropdown">Home</NuxtLink>
        <NuxtLink to="/shelves" @click="toggleDropdown" v-if="userAuth"
          >Library</NuxtLink
        >
        <NuxtLink to="/account" @click="toggleDropdown" v-if="userAuth"
          >Account</NuxtLink
        >
        <NuxtLink to="https://trello.com/b/HG9elwZ0/roadmap" target="_blank">
          Roadmap
        </NuxtLink>
        <hr />
        <NuxtLink
          v-if="!userAuth"
          to="/"
          @click="toggleDropdown"
          class="exempt"
        >
          Sign in
        </NuxtLink>
        <ButtonInline text="Sign out" @click="signOut" v-if="userAuth" />
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useModalStore } from "~/store/ModalStore";
import { useUserStore } from "~/store/UserStore";

export default {
  setup() {
    const userAuth = useSupabaseUser();

    const modalStore = useModalStore();

    const showDropdown = ref(false);
    function toggleDropdown() {
      if (showDropdown.value) {
        showDropdown.value = false;
        modalStore.closeModal();
      } else {
        showDropdown.value = true;
        modalStore.openModal();
      }
    }

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        showDropdown.value = false;
      }
    });

    // Sign Out
    const userStore = useUserStore();
    function signOut() {
      modalStore.closeAllModals();
      userStore.signOut();
    }

    return {
      userAuth,
      showDropdown,
      toggleDropdown,
      signOut,
    };
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
.mobile-navigation__dropdown a:not(.exempt) {
  text-decoration: none;
  color: var(--color-black);
}
</style>
