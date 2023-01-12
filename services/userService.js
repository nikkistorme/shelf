export const signInWithPassword = async (email, password) => {
  const supabase = useSupabaseClient();
  try {
    const { user } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  const supabase = useSupabaseClient();
  try {
    const { data: profile } = await supabase.from("profiles").select();
    return profile[0];
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  try {
    await supabase.auth.signOut();
  } catch (error) {
    throw error;
  }
  router.push("/");
};

export const resetPassword = async (password) => {
  const supabase = useSupabaseClient();
  try {
    await supabase.auth.update({
      password,
    });
  } catch (error) {
    throw error;
  }
};
