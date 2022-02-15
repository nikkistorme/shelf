<template>
  <div class="shelf">
    <div class="shelf-content" v-if="booksOnShelf">
      <Book v-for="(book, i) in booksOnShelf" :key="i" :book="book" />
    </div>
    <div class="shelf-floor">
      <h4 @click="logToConsole">{{ shelf.name }}</h4>
      <div class="shelf-sort" v-if="shelf.sort">
        <select
          v-model="shelf.sort.method"
          name="shelfSort"
          @change="changeSortMethod"
        >
          <option value="dateAdded">Date Added</option>
          <option value="dateStarted" v-if="shelf.inProgressShelf"
            >Date Started</option
          >
          <option value="percentComplete" v-if="shelf.inProgressShelf"
            >Progress</option
          >
          <option value="lastUpdatedProgress" v-if="shelf.inProgressShelf"
            >Last Updated Progress</option
          >
          <option value="dateAddedToShelf" v-if="!shelf.inProgressShelf"
            >Date Added To Shelf</option
          >
        </select>
        <font-awesome-icon
          icon="sort-down"
          v-if="shelf.sort.descending"
          @click="changeSortDirection"
        />
        <font-awesome-icon
          icon="sort-up"
          v-if="!shelf.sort.descending"
          @click="changeSortDirection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sortOptions from "./sorting";

import Book from "../Book.vue";

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
      if (this?.shelf?.id && this.books.length) {
        let booksArray = this.books.filter(b => {
          return b.shelves.includes(this.shelf.id);
        });
        booksArray.sort((a, b) =>
          sortOptions.selectedSortMethod(a, b, this.shelf)
        );
        return booksArray;
      } else {
        return [];
      }
    }
  },
  methods: {
    logToConsole: function() {
      console.log(this.shelf);
    },
    changeSortMethod: function() {
      this.$store.dispatch("updateShelfSort", this.shelf);
    },
    changeSortDirection: function() {
      this.shelf.sort.descending = !this.shelf.sort.descending;
      this.$store.dispatch("updateShelfSort", this.shelf);
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
  display: -webkit-flex;
  flex-direction: row;
  width: 100%;
  padding: 2px;
  overflow-x: auto;
  overflow-y: hidden;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  align-items: flex-end;
}
.shelf-floor {
  display: flex;
  justify-content: space-between;
  height: 25px;
  width: 100%;
  padding: 0 10px;
  background: white;
  box-shadow: gray 5px 5px 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.shelf-sort {
  display: flex;
  select {
    border: none;
    margin-right: 5px;
    background: none;
    text-align: right;
  }
  svg {
    font-size: 20px;
  }
  .fa-sort-up {
    align-self: flex-end;
  }
}
</style>
