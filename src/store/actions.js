const fb = require("../firebaseConfig.js");

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
          book.id = doc.id;
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

const createBookAndAddToShelf = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin createBookAndAddToShelf");
    commit("setStatus", "loading");
    const newShelf = state.shelves.find(s => s.id === payload.shelf);
    fb.booksCollection.add(payload.book).then(newBookRef => {
      newShelf.books.push(newBookRef.id);
      fb.shelvesCollection
        .doc(payload.shelf)
        .update({
          books: newShelf.books
        })
        .then(() => {
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
  });
};

const updateBook = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin updateBook");
    fb.booksCollection
      .doc(payload.id)
      .set(payload)
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

const updatePage = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin updatePage");
    fb.booksCollection
      .doc(payload.id)
      .update({
        currentPage: payload.currentPage
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

const markAsRead = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    console.log("Begin markAsRead");
    const currentShelves = state.shelves;
    let finishedBook = payload;
    finishedBook.currentPage = finishedBook.pageCount;
    finishedBook.goalDate = "";
    const newShelves = currentShelves.map(s => {
      if (s.id === "default-reading") {
        s.books = s.books.filter(v => {
          return v.title !== finishedBook.title;
        });
      }
      if (s.id === "default-read") {
        s.books.push(finishedBook);
      }
      return s;
    });
    fb.usersCollection
      .doc(state.currentUser.uid)
      .update({
        shelves: newShelves
      })
      .then(() => {
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

export default {
  signUpAction,
  signInAction,
  signOutAction,
  fetchUser,
  getUserShelvesBooks,
  updateUser,
  fetchUserShelves,
  fetchUserBooks,
  createBookAndAddToShelf,
  updateBook,
  updatePage,
  markAsRead
};
