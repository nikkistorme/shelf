<template>
  <section id="shelves" class="section-with-margin">
    <Multiselect
      v-model="chosenShelf"
      :options="selectableShelves"
      :searchable="false"
      :allow-empty="false"
      placeholder="Choose a shelf"
      deselect-label="Can't remove this value"
      label="name"
      track-by="id"
    />
    <div class="shelf-contents">
      <Book v-for="(book, i) in booksOnChosenShelf" :key="i" :book="book" />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import Book from "./Book.vue";

import Multiselect from "vue-multiselect";

const helpers = require("../helpers");

export default {
  components: {
    Book,
    Multiselect
  },
  data() {
    return {
      chosenShelf: "",
      chosenShelfId: "",
      selectableShelves: []
    };
  },
  computed: {
    ...mapGetters(["books", "shelves", "userProfile", "currentUser"]),
    booksOnChosenShelf: function() {
      if (this.chosenShelf.id && this.books?.length) {
        const filteredBooks = this.books.filter(b => {
          console.log(b.shelves);
          console.log(
            "🚀 ~ file: Shelves.vue ~ line 51 ~ this.chosenShelf.id",
            this.chosenShelf.id
          );
          return b.shelves.includes(this.chosenShelf.id);
        });
        console.log(
          "🚀 ~ file: Shelves.vue ~ line 51 ~ filteredBooks",
          filteredBooks
        );
        return filteredBooks;
      } else if (this.books?.length) {
        return this.books;
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapMutations(["setUserProfile"])
  },
  watch: {
    userProfile: function(newUser) {
      if (newUser.activeShelf.length) {
        this.chosenShelfId = newUser.activeShelf;
      }
    },
    shelves: function(newShelves) {
      const allBooksShelf = { ...helpers.default.shelf };
      allBooksShelf.name = "All Books";
      if (this.chosenShelf === "") {
        this.chosenShelf = allBooksShelf;
      }
      this.selectableShelves = [...newShelves];
      this.selectableShelves.unshift(allBooksShelf);
    },
    chosenShelf: function(newShelf) {
      console.log("🚀 ~ file: Shelves.vue ~ line 98 ~ newShelf", newShelf);
      console.log("udpating active shelf");
      if (newShelf) {
        this.userProfile.activeShelf = newShelf.id;
      }
      this.$store.dispatch("updateUser", this.userProfile);
    }
  }
};
</script>

<style lang="scss">
#shelves {
  display: flex;
  flex-direction: column;
  .multiselect {
    margin-bottom: 2rem;
  }
  .shelf-contents {
    -ms-box-orient: horizontal;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -moz-flex;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }
  .volume {
    padding: 10px;
  }
  .movie-poster {
    display: flex;
    width: 128px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
}
</style>
