export const signUpWithEmail = async (email, password) => {
  const supabase = useSupabaseClient();
  try {
    const { user } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const addUserProfile = async (userId, creds) => {
  const supabase = useSupabaseClient();
  if (!creds?.name) creds.name = "Rad Reader";
  try {
    const { data } = await supabase
      .from("profiles")
      .insert([{ user_id: userId, ...creds }]);
    if (data?.length > 0) return data[0];
    throw new Error("User not found");
  } catch (error) {
    throw error;
  }
};

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
    if (profile?.length > 0) return profile[0];
    throw new Error("User profile not found");
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
