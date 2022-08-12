<template>
  <main class="login-page">
    <div class="login-page__form-card d-flex ai-center flex-column">
      <h4 v-if="activeForm === 'sign-up'">Create Account</h4>
      <h4 v-if="activeForm === 'login'">Login</h4>
      <h4 v-if="activeForm === 'password-reset'">Forgot Password</h4>
      <form
        class="login-page__form d-flex flex-column ai-center w-100"
        @submit.prevent="submitForm"
      >
        <DefaultInput
          v-show="activeForm === 'sign-up'"
          id="name"
          v-model="credentials.name"
          type="text"
          label="Name"
        />
        <DefaultInput
          id="email"
          v-model="credentials.email"
          type="email"
          label="Email"
        />
        <PasswordInput
          v-if="activeForm !== 'password-reset'"
          id="password"
          v-model="credentials.password"
          class="w-100"
          label="Password"
        />
        <div v-if="errors.length" class="login-page__errors">
          <ul>
            <li v-for="(error, i) in errors" :key="i">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="d-flex jc-space-between w-100 my-1">
          <DefaultButton
            :text="submitButtonText"
            :disabled="disableForm"
            type="submit"
          />
          <InlineButton
            v-if="activeForm !== 'password-reset'"
            text="Forgot password?"
            @click="showForm('password-reset')"
          />
        </div>
      </form>
      <div class="login-page__account-prompts w-100">
        <p v-if="activeForm !== 'login'">
          Already have an account?
          <InlineButton
            class="login-page__sign-in"
            text="Sign in"
            @click="showForm('login')"
          />
        </p>
        <p v-if="activeForm !== 'sign-up'">
          Don't have an account?
          <InlineButton
            class="login-page__sign-in"
            text="Sign up"
            @click="showForm('sign-up')"
          />
        </p>
      </div>
    </div>
    <!-- <p v-if="userLoading">Loading...</p> -->
  </main>
</template>

<script>
import { mapGetters } from "vuex";

import InlineButton from "../components/buttons/InlineButton.vue";
import DefaultInput from "../components/forms/DefaultInput.vue";
import DefaultButton from "../components/buttons/DefaultButton.vue";
import PasswordInput from "../components/forms/PasswordInput.vue";

export default {
  components: { InlineButton, DefaultInput, DefaultButton, PasswordInput },
  data() {
    return {
      activeForm: "sign-up",
      credentials: {
        name: "",
        email: "",
        password: "",
      },
      errors: [],
    };
  },
  computed: {
    ...mapGetters(["userLoading"]),
    disableForm() {
      switch (this.activeForm) {
        case "sign-up":
          return (
            !this.credentials.name ||
            !this.credentials.email ||
            !this.credentials.password
          );
        case "login":
          return !this.credentials.email || !this.credentials.password;
        case "password-reset":
          return !this.credentials.email;
        default:
          return false;
      }
    },
    submitButtonText() {
      switch (this.activeForm) {
        case "sign-up":
          return "Sign up";
        case "login":
          return "Login";
        case "password-reset":
          return "Send reset email";
        default:
          return "Sign up";
      }
    },
  },
  methods: {
    showForm(form) {
      this.errors = [];
      this.activeForm = form;
    },
    checkForm() {
      this.errors = [];
      if (this.activeForm === "sign-up" && !this.credentials.name) {
        this.errors.push("Name required to sign up.");
      }
      if (!this.credentials.email) {
        this.errors.push("Email required.");
      }
      if (this.activeForm !== "password-reset" && !this.credentials.password) {
        this.errors.push("Password required.");
      }
      if (
        this.activeForm !== "password-reset" &&
        this.credentials.password.length < 8
      ) {
        console.log(
          "🚀 ~ this.credentials.password.length",
          this.credentials.password.length
        );
        this.errors.push("Password must be at least 8 characters.");
      }
      console.log("🚀 ~ this.errors", this.errors);
    },
    async submitForm() {
      this.checkForm();
      if (this.errors.length === 0) {
        try {
          if (this.activeForm === "login") {
            await this.$store.dispatch("signIn", this.credentials);
          } else if (this.activeForm === "sign-up") {
            await this.$store.dispatch("signUp", this.credentials);
          } else if (this.activeForm === "password-reset") {
            await this.$store.dispatch("resetPassword", this.credentials.email);
          }
        } catch (error) {
          this.errors.push(error);
        }
      }
    },
    async resetPassword() {
      await this.$store.dispatch("resetPassword", this.credentials);
      this.showForm("login");
    },
  },
};
</script>

<style>
.login-page {
  margin: var(--spacing-size-3) var(--spacing-size-1);
}
.login-page__form-card {
  max-width: 400px;
  padding: var(--spacing-size-1) var(--spacing-size-2);
  margin: auto;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-1);
}
.login-page .inline-button {
  color: var(--color-primary);
}
.login-page__sign-in {
  font-style: italic;
  color: var(--color-primary);
}
.login-page__form {
  gap: var(--spacing-size-1);
  margin-top: var(--spacing-size-1);
}
.login-page__form .default-input {
  width: 100%;
}
.login-page__form .input {
  width: 100%;
}
.login-page__errors li {
  color: var(--color-red);
}
.login-page__account-prompts {
  text-align: right;
}
</style>
