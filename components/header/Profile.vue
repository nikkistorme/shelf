<template>
  <div class="header-profile">
    <div class="header-profile__image" @click="toggleDropdown">
      <img
        v-if="userStore?.profile?.image"
        :src="userStore.profile.image"
        loading="lazy"
        :alt="userStore.profile.name"
      />
      <div
        v-else
        class="header-profile__image-placeholder d-flex jc-center ai-center"
      >
        {{ userStore?.profile?.name ? userStore.profile.name[0] : "" }}
      </div>
    </div>
    <div
      class="header-profile-dropdown dropdown-modal-menu flex-column"
      :class="{ open: showDropdown }"
    >
      <div v-if="userStore?.profile?.id" class="d-flex flex-column p-1">
        <NuxtLink to="/account" @click="toggleDropdown">Account</NuxtLink>
        <hr class="my-1" />
        <ButtonInline @click="signOut">Sign out</ButtonInline>
      </div>
      <div v-else class="d-flex flex-column p-1">
        <NuxtLink to="/" @click="toggleDropdown">Sign in</NuxtLink>
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
    const userStore = useUserStore();

    // Account info dropdown
    const showDropdown = ref(false);
    const modalStore = useModalStore();

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
    function signOut() {
      modalStore.closeAllModals();
      userStore.signOut();
    }

    return {
      userStore,
      showDropdown,
      toggleDropdown,
      signOut,
    };
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
  border-radius: 50%;
  background-color: var(--color-grey);
  font-size: var(--font-size-2);
  color: var(--color-primary);
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
.header-profile-dropdown a {
  text-decoration: none;
  color: var(--color-black);
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
