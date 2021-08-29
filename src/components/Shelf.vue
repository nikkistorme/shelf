<template>
  <div class="shelf">
    <div class="shelf-content" v-if="booksOnShelf">
      <Book v-for="(book, i) in booksOnShelf" :key="i" :book="book" />
    </div>
    <div class="shelf-floor">
      <h4>{{ shelf.name }}</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Book from "./Book.vue";

const sortVolumes = (a, b) => {
  if (a.goalDate && b.goalDate) {
    return a.goalDate > b.goalDate;
  } else if (a.goalDate) {
    return -1;
  } else if (b.goalDate) {
    return 1;
  } else {
    return 0;
  }
};

export default {
  props: {
    shelf: {
      type: Object,
      required: true
    }
  },
  components: {
    Book
  },
  computed: {
    ...mapGetters(["books", "showNav"]),
    booksOnShelf: function() {
      if (this.shelf?.id === "In Progress") {
        console.log("In Progress Shelf");
        let booksArray = this.books.filter(b => {
          return b.inProgress;
        });
        return booksArray;
      }
      if (this.shelf?.id && this.books.length) {
        let booksArray = this.books.filter(b => {
          return b.shelves.includes(this.shelf.id);
        });
        booksArray.sort((a, b) => sortVolumes(a, b));
        return booksArray;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss">
.shelf {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 5rem;
}
.shelf-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2px;
  overflow-x: auto;
  overflow-y: hidden;
  justify-content: flex-start;
  align-items: flex-end;
}
.shelf-floor {
  height: 25px;
  width: 100%;
  background: white;
  border: 0.5px black solid;
  padding-left: 2px;
  box-shadow: black 0px 2px 5px -2px;
}
</style>
