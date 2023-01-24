import { defineStore } from "pinia";
import {
  signUpWithEmail,
  addUserProfile,
  signInWithPassword,
  getProfile,
  signOut,
  resetPassword,
} from "~/services/userService";

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    profile: null,
    loading: false,
  }),
  actions: {
    async signUpWithEmail(email, password, creds) {
      this.loading = true;
      try {
        // Create user
        const userAuth = await signUpWithEmail(email, password);
        // Create user profile
        await addUserProfile(userAuth.id, creds);
        // Sign in
        await signInWithPassword(email, password);
        const profile = await getProfile();
        this.profile = profile;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
      return this.profile;
    },
    async signInWithPassword(email, password) {
      this.loading = true;
      try {
        await signInWithPassword(email, password);
        const profile = await getProfile();
        this.profile = profile;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
      return this.profile;
    },
    async signOut() {
      this.loading = true;
      this.profile = {};
      await signOut();
      this.loading = false;
    },
    async resetPassword(password) {
      this.loading = true;
      console.log("🚀 ~ password", password);
      await resetPassword(password);
      this.loading = false;
    },
    async fetchProfile() {
      this.loading = true;
      try {
        const profile = await getProfile();
        this.profile = profile;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
  },
});
