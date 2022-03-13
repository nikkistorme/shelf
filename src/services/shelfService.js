import fb from "../firebase";

const formatError = (error) => {
  switch (error.code) {
    case "auth/requires-recent-login":
      return new Error(
        "Your session is too old. Sign in again to update your password."
      );
    default:
      return error;
  }
};

const addShelf = async (shelf) => {
  try {
    await fb.shelvesCollection.doc(shelf.id).set(shelf);
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

const getShelves = async () => {
  let allShelves = [];
  try {
    const querySnapshot = await fb.shelvesCollection
      .where("user", "==", fb.auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let shelf = doc.data();
      shelf.id = doc.id;
      allShelves.push(shelf);
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
  return allShelves;
};

const updateShelfSort = async (shelf) => {
  try {
    await fb.shelvesCollection.doc(shelf.id).update({
      sort: shelf.sort,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

export default {
  addShelf,
  getShelves,
  updateShelfSort,
};
