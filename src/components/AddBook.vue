<template>
  <section id="add_book" class="search section-with-margin">
    <BookSearchForm :search="search" :getVolume="getVolume" />
    <p class="or">or</p>
    <button class="black_button" @click="createBook">
      Add Manually
    </button>
    <div class="search-results" v-if="results">
      <BookSearchItem v-for="(book, i) in results" :key="i" :book="book" />
    </div>
  </section>
</template>

<script>
import { mapMutations } from "vuex";

import BookSearchForm from "./BookSearchForm";
import BookSearchItem from "./BookSearchItem";

const helpers = require("../helpers");

export default {
  components: {
    BookSearchForm,
    BookSearchItem
  },
  data() {
    return {
      results: [],
      search: {
        keyword: "",
        author: ""
      },
      google_books_api: process.env.VUE_APP_GOOGLE_BOOKS_API_KEY
    };
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    getVolume() {
      const keywordUrl = `${this.search.keyword}`;
      let authorUrl = "";
      if (this.search.author && !this.search.keyword) {
        authorUrl = `inauthor:${this.search.author}`;
      } else if (this.search.author && this.search.keyword) {
        authorUrl = `+inauthor:${this.search.author}`;
      }
      const url = `https://www.googleapis.com/books/v1/volumes?q=${
        this.search.keyword ? keywordUrl : ""
      }${this.search.author ? authorUrl : ""}&key=${this.google_books_api}`;
      console.log(url);
      this.$http
        .get(url)
        .then(
          response => response.json(),
          error => {
            console.log(error);
          }
        )
        .then(data => {
          const dataVolumes = data.items.map(v => {
            if (v.volumeInfo) {
              const oldVolume = Object.assign(
                {},
                helpers.default.book,
                v.volumeInfo
              );
              let newVolume = { ...helpers.default.book };
              if (oldVolume.authors) {
                newVolume.author = helpers.default.stringFromArrayOfStrings(
                  oldVolume.authors
                );
              }
              newVolume.description = oldVolume.description;
              if (oldVolume.imageLinks?.thumbnail) {
                newVolume.image = oldVolume.imageLinks.thumbnail;
              }
              newVolume.title = oldVolume.title;
              newVolume.totalPages = oldVolume.pageCount;
              return newVolume;
            }
          });
          this.results = [];
          this.results = this.results.concat(dataVolumes);
        });
    },
    createBook() {
      let newBook = { ...helpers.default.book };
      const newDrawer = {
        content: newBook,
        type: "addBook"
      };
      this.$store.commit("setDrawer", newDrawer);
    }
  }
};
</script>

<style lang="scss">
#add_book {
  .or {
    margin-top: 1rem;
  }
}
.search {
  text-align: center;
  .black_button {
    margin-top: 1rem;
  }
  .search-results {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }
}
</style>
