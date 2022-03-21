import fb from "../firebase";

const formatError = (error) => {
  console.log("🚀 ~ error", error);
  console.log("🚀 ~ error.code", error.code);
  switch (error.code) {
    case "auth/requires-recent-login":
      return new Error(
        "Your session is too old. Sign in again to update your password."
      );
    case "auth/wrong-password":
      return new Error(
        "That password is incorrect. Please try again or reset your password."
      );
    case "auth/email-already-in-use":
      return new Error(
        "There is already a user with this email. Sign in or try a different email address."
      );
    case "auth/user-not-found":
      return new Error(
        "There is no existing user with that email. Sign up or try a different email address."
      );
    case "auth/weak-password":
      return new Error("Password must be at least 6 characters long.");
    default:
      return error;
  }
};

const signUp = async (credentials) => {
  try {
    const response = await fb.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    return response.user;
  } catch (error) {
    throw formatError(error);
  }
};

const signIn = async (credentials) => {
  let user = null;
  try {
    const response = await fb.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    user = response.user;
  } catch (error) {
    throw formatError(error);
  }
  return user;
};

const signOut = async () => {
  try {
    fb.auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (email) => {
  try {
    await fb.auth.sendPasswordResetEmail(email);
  } catch (error) {
    throw formatError(error);
  }
};

const updatePassword = async (password) => {
  try {
    await fb.auth.currentUser.updatePassword(password);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const createUser = async (user) => {
  try {
    await fb.usersCollection.doc(user.id).set(user);
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

const getUser = async (uid) => {
  try {
    const response = await fb.usersCollection.doc(uid).get();
    return response.data();
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

export default {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  createUser,
  getUser,
};
