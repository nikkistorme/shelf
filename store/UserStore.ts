import { defineStore } from "pinia";
import {
  signUpWithEmail,
  addUserProfile,
  signInWithPassword,
  getProfile,
  signOut,
  resetPassword,
} from "~/services/userService";

interface UserProfile {
  user_id: string
  id: number
  inserted_at: string
  updated_at: string
  name: string
  image: string
}

interface NewProfileCredentials {
  name: string
}

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
  }),
  actions: {
    async signUpWithEmail(email: string, password: string, creds: NewProfileCredentials): Promise<void> {
      this.loading = true;
      let profile;
      try {
        // Create user
        const userAuth = await signUpWithEmail(email, password);
        // Create user profile
        if (userAuth) {
          await addUserProfile(userAuth.id, creds);
          profile = await getProfile();
        }
        this.profile = profile;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async signInWithPassword(email: string, password: string): Promise<void> {
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
    },
    async signOut() {
      this.loading = true;
      this.profile = null;
      await signOut();
      this.loading = false;
    },
    async resetPassword(password: string) {
      this.loading = true;
      try {
        await resetPassword(password);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async addUserProfile(creds = {}) {
      this.loading = true;
      const userAuth = useSupabaseUser();
      if (!userAuth.value) throw new Error("User not authenticated");
      try {
        const profile = await addUserProfile(userAuth.value.id, creds);
        this.profile = profile;
      } catch (error) {
        this.loading = false;
        throw error;
      }
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
