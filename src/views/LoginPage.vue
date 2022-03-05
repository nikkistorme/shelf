<template>
  <main class="login-page">
    <div class="login-page__form-card d-flex al-center flex-column">
      <h4 v-if="activeForm === 'sign-up'">Create Account</h4>
      <h4 v-if="activeForm === 'login'">Login</h4>
      <h4 v-if="activeForm === 'password-reset'">Forgot Password</h4>
      <form
        class="login-page__form d-flex flex-column al-center w-100"
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
        <DefaultInput
          v-if="activeForm !== 'password-reset'"
          id="password"
          v-model="credentials.password"
          type="password"
          label="Password"
        />
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
  </main>
</template>

<script>
import InlineButton from "../components/buttons/InlineButton.vue";
import DefaultInput from "../components/forms/DefaultInput.vue";
import DefaultButton from "../components/buttons/DefaultButton.vue";

export default {
  components: { InlineButton, DefaultInput, DefaultButton },
  data() {
    return {
      activeForm: "sign-up",
      credentials: {
        name: "",
        email: "",
        password: "",
      },
      status: "",
      message: "",
    };
  },
  computed: {
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
    test() {
      console.log(this.activeForm);
    },
    showForm(form) {
      this.activeForm = form;
    },
    async submitForm() {
      try {
        if (this.activeForm === "login") {
          await this.$store.dispatch("signIn", this.credentials);
        } else if (this.activeForm === "sign-up") {
          await this.$store.dispatch("signUp", this.credentials);
        } else if (this.activeForm === "password-reset") {
          await this.$store.dispatch("resetPassword", this.credentials.email);
        }
      } catch (error) {
        this.message = error;
        this.status = "failure";
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
  color: var(--color-blue);
}
.login-page__sign-in {
  font-style: italic;
  color: var(--color-blue);
}
.login-page__form {
  margin-top: var(--spacing-size-1);
}
.login-page__form .default-input {
  width: 100%;
}
.login-page__form .input {
  width: 100%;
}
.login-page__account-prompts {
  text-align: right;
}
</style>
