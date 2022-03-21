import fb from "../firebase";
import { v4 as uuidv4 } from "uuid";

const newID = () => {
  return uuidv4().toLowerCase();
};

export const shelfSchema = {
  name: "",
  user: "",
  id: "",
  sort: {
    descending: true,
    method: "date-added-to-library",
  },
};

const formatError = (error) => {
  console.log("🚀 ~ error.code", error.code);
  switch (error.code) {
    case "auth/requires-recent-login":
      return new Error(
        "Your session is too old. Sign in again to update your password."
      );
    default:
      return error;
  }
};

export const newShelfObject = (name = "", user = "") => {
  let shelf = Object.assign({}, shelfSchema);
  shelf.name = name;
  shelf.user = user;
  shelf.id = newID();
  return shelf;
};

export const addShelf = async (shelf) => {
  try {
    await fb.shelvesCollection.doc(shelf.id).set(shelf);
  } catch (error) {
    throw formatError(error);
  }
};

export const addShelves = async (shelves) => {
  try {
    await Promise.all(shelves.map((shelf) => addShelf(shelf)));
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const getShelves = async () => {
  let allShelves = [];
  const shelvesToUpdate = [];
  try {
    const querySnapshot = await fb.shelvesCollection
      .where("user", "==", fb.auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let shelf = doc.data();
      if (!shelf.id) {
        shelf.id = doc.id;
        shelvesToUpdate.push(shelf);
      }
      allShelves.push(shelf);
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
  if (shelvesToUpdate.length > 0) {
    console.log("Adding IDs to shelf documents:", shelvesToUpdate);
    shelvesToUpdate.forEach((shelf) => {
      fb.shelvesCollection.doc(shelf.id).set(shelf);
    });
  }
  return allShelves;
};

export const updateShelves = async (shelves) => {
  try {
    if (shelves.length > 0) {
      await Promise.all(
        shelves.forEach((shelf) => {
          fb.shelvesCollection.doc(shelf.id).set(shelf);
        })
      );
    }
  } catch (error) {
    throw formatError(error);
  }
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

const deleteShelf = async (shelf) => {
  try {
    await fb.shelvesCollection.doc(shelf.id).delete();
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

export default {
  newShelfObject,
  addShelf,
  addShelves,
  getShelves,
  updateShelves,
  updateShelfSort,
  deleteShelf,
};
