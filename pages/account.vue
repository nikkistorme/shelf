<template>
  <div class="account-page d-flex flex-column ai-center w-100">
    <div class="d-flex jc-center w-100">
      <div class="account-page__image">
        <img
          v-if="userStore?.profile?.image"
          :src="userStore.profile.image"
          :alt="`Profile picture for ${userStore.profile.name}`"
        />
        <div
          v-else
          class="account-page__image-placeholder d-flex jc-center ai-center"
        >
          {{ userStore?.profile?.name ? userStore.profile.name[0] : "" }}
        </div>
      </div>
    </div>
    <h3 class="account-page__name mb-3">{{ userStore.profile.name }}</h3>
    <div class="account-page__grid d-flex jc-center">
      <div class="card w-100">
        <h4>Reset Password</h4>
        <form
          class="account-page__password-reset-form d-flex flex-column gap-1"
          @submit.prevent="resetPassword"
        >
          <InputDefault
            id="new-password"
            v-model="passwordReset.newPassword"
            type="password"
            label="New Password"
          />
          <InputDefault
            id="confirm-password"
            v-model="passwordReset.confirmPassword"
            type="password"
            label="Confirm Password"
          />
          <ButtonDefault :disabled="disableResetPassword" type="submit">
            Reset Password
          </ButtonDefault>
        </form>
        <p
          v-if="passwordReset.status.length"
          class="account-page__password-reset-message mt-1"
          :class="passwordReset.status"
        >
          {{ passwordReset.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "~/store/UserStore";

export default {
  setup() {
    definePageMeta({
      middleware: "user-auth",
    });
    const userStore = useUserStore();
    const passwordReset = ref({
      newPassword: "",
      confirmPassword: "",
      status: "",
      message: "",
    });

    const disableResetPassword = computed(() => {
      return (
        passwordReset?.value.newPassword?.length === 0 ||
        passwordReset?.value.confirmPassword?.length === 0 ||
        passwordReset?.value.newPassword !==
          passwordReset?.value.confirmPassword
      );
    });

    async function resetPassword() {
      if (!disableResetPassword.value) {
        try {
          await userStore.resetPassword(passwordReset.value.newPassword);
          passwordReset.value.newPassword = "";
          passwordReset.value.confirmPassword = "";
          passwordReset.value.message = "Password updated successfully";
          passwordReset.value.status = "success";
        } catch (error) {
          passwordReset.value.message = error;
          passwordReset.value.status = "failure";
        }
      }
    }

    return {
      userStore,
      passwordReset,
      disableResetPassword,
      resetPassword,
    };
  },
};
</script>

<style>
.account-page {
}
.account-page__image {
  height: 100px;
  width: 100px;
  margin-bottom: var(--spacing-size-1);
}
.account-page__image img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.account-page__image-placeholder {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: var(--color-grey);
  font-size: var(--font-size-2);
  color: var(--color-primary);
}
.account-page__name {
  text-align: center;
}
.account-page__password-reset-message {
  text-align: center;
}
.account-page__password-reset-message.success {
  color: var(--color-green);
}
.account-page__password-reset-message.failure {
  color: var(--color-red);
}
.account-page__grid {
  width: 100%;
  max-width: 400px;
}
</style>
