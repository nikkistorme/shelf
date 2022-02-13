const fb = require("../firebaseConfig.js");
import { v4 as uuidv4 } from "uuid";

// Accounts
const signUpAction = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin signUpAction");
    commit("setStatus", "loading");
    fb.auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        commit("setCurrentUser", response.user);
        fb.usersCollection.doc(response.user.uid).set({
          activeShelf: "",
          id: response.user.uid,
          name: payload.name
        });
      })
      .then(() => {
        fb.shelvesCollection.add({
          books: [],
          name: "Finished",
          user: state.currentUser.uid
        });
      })
      .then(() => {
        fb.shelvesCollection.add({
          books: [],
          name: "In Progress",
          user: state.currentUser.uid
        });
      })
      .then(() => {
        console.log("signUpAction success");
        dispatch("fetchUser");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("signUpAction failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const signInAction = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin signInAction");
    commit("setStatus", "loading");
    fb.auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        commit("setCurrentUser", response.user);
        dispatch("fetchUser");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const signOutAction = ({ commit }) => {
  return new Promise((resolve, reject) => {
    console.log("Begin signOutAction");
    fb.auth
      .signOut()
      .then(() => {
        commit("setCurrentUser", null);
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("error", error);
        commit("setStatus", "failure");
        reject();
      });
  });
};

// Users
const fetchUser = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    console.log("Begin fetchUser");
    commit("setStatus", "loading");
    fb.usersCollection
      .doc(state.currentUser.uid)
      .get()
      .then(response => {
        console.log("fetchUser success");
        commit("setUserProfile", response.data());
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("fetchUser failure");
        console.log(error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const getUserShelvesBooks = ({ commit, dispatch }) => {
  return new Promise((resolve, reject) => {
    console.log("Begin getUserShelvesBooks");
    commit("setStatus", "loading");
    dispatch("fetchUser")
      .then(() => {
        dispatch("fetchUserShelves");
      })
      .then(() => {
        dispatch("fetchUserBooks");
      })
      .then(() => {
        console.log("getUserShelvesBooks success");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("getUserShelvesBooks failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const updateUser = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin updateUser");
    payload.id = state.currentUser.uid;
    fb.usersCollection
      .doc(payload.id)
      .set(payload)
      .then(() => {
        console.log("updateUser success");
        dispatch("fetchUser");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("updateUser failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

// Shelves
const fetchUserShelves = ({ commit, state }) => {
  console.log("Begin fetchUserShelves");
  return new Promise((resolve, reject) => {
    commit("setStatus", "loading");
    fb.shelvesCollection
      .where("user", "==", state.currentUser.uid)
      .get()
      .then(querySnapshot => {
        console.log("fetchUserShelves success");
        let shelvesArray = [];
        querySnapshot.forEach(doc => {
          let shelf = doc.data();
          shelf.id = doc.id;
          shelvesArray.push(shelf);
        });
        commit("setUserShelves", shelvesArray);
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("fetchUserShelves failure");
        console.log(error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const addBookToShelf = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin addBookToShelf");
    fb.shelvesCollection
      .doc(payload.id)
      .update({ books: payload.books })
      .then(() => {
        console.log("addBookToShelf success");
        commit("setStatus", "success");
        dispatch("fetchUserShelves");
        resolve();
      })
      .catch(error => {
        console.log("addBookToShelf failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

// Books
const fetchUserBooks = ({ commit, state }) => {
  console.log("Begin fetchUserBooks");
  return new Promise((resolve, reject) => {
    commit("setStatus", "loading");
    fb.booksCollection
      .where("user", "==", state.currentUser.uid)
      .get()
      .then(querySnapshot => {
        let booksArray = [];
        querySnapshot.forEach(doc => {
          let book = doc.data();
          booksArray.push(book);
        });
        commit("setUserBooks", booksArray);
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

// const createBookAndAddToShelf = ({ commit, dispatch, state }, payload) => {
//   return new Promise((resolve, reject) => {
//     console.log("Begin createBookAndAddToShelf");
//     commit("setStatus", "loading");
//     const newShelf = state.shelves.find(s => s.id === payload.shelf);
//     fb.booksCollection.add(payload.book).then(newBookRef => {
//       newShelf.books.push(newBookRef.id);
//       fb.shelvesCollection
//         .doc(payload.shelf)
//         .update({
//           books: newShelf.books
//         })
//         .then(() => {
//           dispatch("fetchUser");
//           commit("setStatus", "success");
//           resolve();
//         })
//         .catch(error => {
//           console.log("error", error);
//           commit("setStatus", error.message);
//           reject();
//         });
//     });
//   });
// };

const addBook = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin addBook");
    commit("setStatus", "loading");
    let book = payload.book;
    book.user = state.currentUser.uid;
    book.id = uuidv4();
    fb.booksCollection
      .doc(book.id)
      .set(book)
      .then(() => {
        console.log("addBook success");
        commit("setStatus", "success");
        dispatch("fetchUserBooks");
        resolve(book);
      })
      .catch(error => {
        console.log("addBook failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const updateBook = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin updateBook");
    payload.book.changes.unshift(payload.change);
    fb.booksCollection
      .doc(payload.book.id)
      .set(payload.book)
      .then(() => {
        console.log("updateBook success");
        dispatch("fetchUserBooks");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("updateBook failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const deleteBook = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin deleteBook");
    fb.booksCollection
      .doc(payload.id)
      .delete()
      .then(() => {
        console.log("deleteBook success");
        dispatch("fetchUserBooks");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("deleteBook failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const updatePage = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin updatePage");
    if (payload.book.changes?.length) {
      payload.book.changes.unshift(payload.change);
    } else {
      payload.book.changes = [payload.change];
    }
    fb.booksCollection
      .doc(payload.book.id)
      .update({
        readPages: payload.change.payload.newValue,
        changes: payload.book.changes
      })
      .then(() => {
        console.log("updatePage success");
        dispatch("fetchUserBooks");
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("updatePage failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const startReading = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin startReading");
    if (!payload.book.changes) {
      payload.book.changes = [];
    }
    payload.book.changes.unshift(payload.change);
    fb.booksCollection
      .doc(payload.book.id)
      .update({
        inProgress: payload.change.payload.newValue,
        finished: false,
        readPages: 0,
        changes: payload.book.changes
      })
      .then(() => {
        console.log("startReading success");
        dispatch("fetchUserBooks");
      })
      .then(() => {
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("startReading failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

const finishReading = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin finishReading");
    if (!payload.book.changes) {
      payload.book.changes = [];
    }
    payload.book.changes.unshift(payload.change);
    fb.booksCollection
      .doc(payload.book.id)
      .update({
        inProgress: false,
        finished: payload.change.payload.newValue,
        readPages: payload.book.totalPages,
        changes: payload.book.changes
      })
      .then(() => {
        console.log("finishReading success");
        dispatch("fetchUserBooks");
      })
      .then(() => {
        commit("setStatus", "success");
        resolve();
      })
      .catch(error => {
        console.log("finishReading failure");
        console.log("error", error);
        commit("setStatus", error.message);
        reject();
      });
  });
};

export default {
  signUpAction,
  signInAction,
  signOutAction,
  fetchUser,
  getUserShelvesBooks,
  updateUser,
  fetchUserShelves,
  addBookToShelf,
  fetchUserBooks,
  // createBookAndAddToShelf,
  addBook,
  updateBook,
  deleteBook,
  updatePage,
  startReading,
  finishReading
};
