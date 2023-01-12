<template>
  <div v-if="!userAuth" class="login-page">
    <div class="login-page__form-card d-flex ai-center flex-column">
      <h4 v-if="activeForm === 'sign-up'">Create Account</h4>
      <h4 v-if="activeForm === 'login'">Login</h4>
      <h4 v-if="activeForm === 'password-reset'">Forgot Password</h4>
      <form
        class="login-page__form d-flex flex-column ai-center w-100"
        @submit.prevent="submitForm"
      >
        <InputDefault
          v-show="activeForm === 'sign-up'"
          id="name"
          v-model="credentials.name"
          type="text"
          label="Name"
        />
        <InputDefault
          id="email"
          v-model="credentials.email"
          type="email"
          label="Email"
        />
        <InputPassword
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
        <div class="d-flex jc-between w-100 my-1">
          <ButtonDefault :disabled="disableForm" type="submit">
            {{ submitButtonText }}
          </ButtonDefault>
          <ButtonInline
            v-if="activeForm !== 'password-reset'"
            text="Forgot password?"
            @click="showForm('password-reset')"
          />
        </div>
      </form>
      <div class="login-page__account-prompts w-100">
        <p v-if="activeForm !== 'login'">
          Already have an account?
          <ButtonInline
            class="login-page__sign-in"
            text="Sign in"
            @click="showForm('login')"
          />
        </p>
        <p v-if="activeForm !== 'sign-up'">
          Don't have an account?
          <ButtonInline
            class="login-page__sign-in"
            text="Sign up"
            @click="showForm('sign-up')"
          />
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
    const router = useRouter();
    const userStore = useUserStore();
    const userAuth = useSupabaseUser();

    const activeForm = ref("sign-up");
    const errors = ref([]);
    const credentials = ref({
      name: "",
      email: "",
      password: "",
    });

    function checkForm() {
      errors.value = [];
      if (activeForm.value === "sign-up" && !credentials.value.name) {
        errors.value.push("Name required to sign up.");
      }
      if (!credentials.value.email) {
        errors.value.push("Email required.");
      }
      if (
        activeForm.value !== "password-reset" &&
        !credentials.value.password
      ) {
        errors.value.push("Password required.");
      }
      if (
        activeForm.value !== "password-reset" &&
        credentials.value.password.length < 8
      ) {
        errors.value.push("Password must be at least 8 characters.");
      }
    }

    async function submitForm() {
      checkForm();
      if (errors.value.length === 0) {
        try {
          if (activeForm.value === "login") {
            await userStore.signInWithPassword(
              credentials.value.email,
              credentials.value.password
            );
            // await userStore.fetchProfile();
            router.push("/home");
          } else if (activeForm.value === "sign-up") {
            // const { newUser, error } = await supabase.auth.signUp();
          } else if (activeForm.value === "password-reset") {
            // await supabase.auth.api.resetPasswordForEmail(
            //   credentials.value.email
            // );
          }
        } catch (error) {
          errors.value.push(error);
        }
      }
    }

    const submitButtonText = computed(() => {
      switch (activeForm.value) {
        case "sign-up":
          return "Sign up";
        case "login":
          return "Login";
        case "password-reset":
          return "Send reset email";
        default:
          return "Sign up";
      }
    });

    const disableForm = computed(() => {
      switch (activeForm.value) {
        case "sign-up":
          return (
            !credentials.value.name ||
            !credentials.value.email ||
            !credentials.value.password
          );
        case "login":
          return !credentials.value.email || !credentials.value.password;
        case "password-reset":
          return !credentials.value.email;
        default:
          return false;
      }
    });

    function showForm(form) {
      errors.value = [];
      activeForm.value = form;
    }

    return {
      activeForm,
      submitForm,
      errors,
      credentials,
      submitButtonText,
      disableForm,
      showForm,
      userAuth,
    };
  },
};
</script>

<style>
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
