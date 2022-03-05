<template>
  <main class="account-page">
    <div
      class="account-page__image d-flex jc-center"
      @click="toggleProfileDropdown"
    >
      <img :src="userProfile.image" alt="" />
    </div>
    <h3 class="account-page__name mb-3">{{ userProfile.name }}</h3>
    <div class="account-page__grid d-flex jc-center">
      <div class="card w-100">
        <h4>Reset Password</h4>
        <form
          class="account-page__password-reset-form"
          @submit.prevent="resetPassword"
        >
          <DefaultInput
            id="new-password"
            v-model="passwordReset.newPassword"
            type="password"
            label="New Password"
          />
          <DefaultInput
            id="confirm-password"
            v-model="passwordReset.confirmPassword"
            type="password"
            label="Confirm Password"
          />
          <DefaultButton
            :disabled="disableResetPassword"
            type="submit"
            text="Reset Password"
          />
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
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import DefaultInput from "../components/forms/DefaultInput.vue";
import DefaultButton from "../components/buttons/DefaultButton.vue";

export default {
  components: { DefaultInput, DefaultButton },
  data() {
    return {
      passwordReset: {
        newPassword: "",
        confirmPassword: "",
        status: "",
        message: "",
      },
    };
  },
  computed: {
    ...mapGetters(["userProfile"]),
    disableResetPassword() {
      return (
        this.passwordReset.newPassword.length === 0 ||
        this.passwordReset.confirmPassword.length === 0 ||
        this.passwordReset.newPassword !== this.passwordReset.confirmPassword
      );
    },
  },
  methods: {
    async resetPassword() {
      if (!this.disableResetPassword) {
        try {
          await this.$store.dispatch(
            "updatePassword",
            this.passwordReset.confirmPassword
          );
          this.passwordReset.newPassword = "";
          this.passwordReset.confirmPassword = "";
          this.passwordReset.message = "Password updated successfully";
          this.passwordReset.status = "success";
        } catch (error) {
          this.passwordReset.message = error;
          this.passwordReset.status = "failure";
        }
      }
    },
  },
};
</script>

<style>
.account-page {
  margin: var(--spacing-size-2) var(--spacing-size-1);
}
.account-page__image {
  height: 100px;
  margin-bottom: var(--spacing-size-1);
}
.account-page__image img {
  height: 100%;
  border-radius: 50%;
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

@media (min-width: 768px) {
  .account-page {
    margin: var(--spacing-size-4);
  }
}
</style>
