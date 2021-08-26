<template>
  <section class="section-with-margin">
    <div class="account_card">
      <h2>{{ !showLoginForm ? "Create account" : "Sign in" }}</h2>
      <p>
        <span v-if="!showLoginForm">Already have an account?</span>
        <i @click="showLoginForm = !showLoginForm">
          {{ showLoginForm ? "Create account" : "Sign in" }}
        </i>
      </p>
      <form class="account_form" v-on:submit.prevent="submitForm">
        <div class="signup" v-if="!showLoginForm">
          <input
            class="input"
            type="email"
            placeholder="email"
            v-model="signupForm.email"
          />
          <div class="compound_input">
            <input
              type="text"
              placeholder="first name"
              v-model="signupForm.firstName"
            />
            <input
              type="text"
              placeholder="last name"
              v-model="signupForm.lastName"
            />
          </div>
          <input
            class="input"
            type="password"
            placeholder="password"
            v-model="signupForm.password"
          />
          <button
            type="submit"
            :disabled="
              !signupForm.email ||
                // eslint-disable-next-line prettier/prettier
              !signupForm.password ||
                // eslint-disable-next-line prettier/prettier
              !signupForm.firstName ||
                // eslint-disable-next-line prettier/prettier
              !signupForm.lastName">
            Sign up
          </button>
        </div>
        <div class="login" v-if="showLoginForm">
          <input
            class="input"
            type="email"
            placeholder="email"
            v-model="loginForm.email"
          />
          <input
            class="input"
            type="password"
            placeholder="password"
            v-model="loginForm.password"
          />
          <button
            type="submit"
            :disabled="!loginForm.email || !loginForm.password"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showLoginForm: false,
      signupForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      },
      loginForm: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm() {
      if (this.showLoginForm) {
        const user = {
          email: this.loginForm.email,
          password: this.loginForm.password
        };
        console.log("user", user);
        this.$store.dispatch("signInAction", user).then(() => {
          this.$router.push("./read");
        });
      } else {
        const user = {
          name: `${this.signupForm.firstName} ${this.signupForm.lastName}`,
          email: this.signupForm.email,
          password: this.signupForm.password
        };
        this.$store.dispatch("signUpAction", user).then(() => {
          this.$router.push("./read");
        });
      }
    }
  }
};
</script>

<style lang="scss">
.account_card {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 450px;
  padding: 2rem;
  border-radius: 10px;
  background-color: white;
  box-shadow: black 0px 1px 10px -4px;
  > * {
    margin-top: 1rem;
  }
}
.account_form {
  width: 100%;
  .signup,
  .login {
    display: flex;
    flex-direction: column;
  }
  button {
    padding: 1rem;
    border: none;
    border-radius: 10px;
    margin-top: 1rem;
    font-weight: bold;
    color: white;
    background-color: #000;
    outline: 0;
    cursor: pointer;
    &:disabled {
      background-color: #d2d2d2;
      pointer-events: none;
    }
  }
}
.input {
  padding: 1rem;
  border: none;
  border-radius: 10px;
  margin-top: 1rem;
  outline: none;
  box-shadow: grey 0px 0px 10px -4px;
}
.compound_input {
  margin-top: 1rem;
  display: flex;
  box-shadow: grey 0px 0px 10px -4px;
  border-radius: 10px;
  overflow: hidden;
  input {
    flex: 1;
    width: 50%;
    border: none;
    outline: none;
    padding: 1rem;
    &:nth-child(n + 2) {
      border-left: 1px #d2d2d2 solid;
    }
    &:input:placeholder-shown {
      background-color: grey;
    }
  }
}
</style>
