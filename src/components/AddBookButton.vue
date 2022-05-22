<template>
  <div class="add-book-button">
    <AddButtonIcon
      class="add-book__icon cursor-pointer h-100 w-100"
      @click="openAddBookOptions"
    />
    <div class="add-book__options" :class="showOptions ? 'open' : ''">
      <div class="add-book__options-list d-flex flex-column jc-space-between">
        <div>
          <form class="add-book__search-form" @submit.prevent="submitSearch">
            <DefaultInput
              v-model="searchTerm"
              class="w-100"
              type="text"
              placeholder="Search books..."
            />
            <CloseIcon
              class="add-book__search-clear-button"
              @click="searchTerm = ''"
            />
          </form>
          <ul
            v-if="showResults"
            class="add-book__results-list d-flex flex-column"
          >
            <li
              v-for="(result, i) in results"
              :key="i"
              class="add-book__result d-flex gap-1 px-1 cursor-pointer"
              @click="openBookResult(result)"
            >
              <div class="add-book__result-cover">
                <img
                  v-if="result.image"
                  :src="result.image"
                  :alt="result.title"
                />
                <div v-else class="add-book__result-cover-placeholder"></div>
              </div>
              <div>
                <p class="add-book__result-title">
                  {{ result.title }}
                </p>
                <p class="add-book__result-author">by {{ result.author }}</p>
              </div>
            </li>
          </ul>
          <MagnifyLoader
            v-if="resultsLoading"
            class="add-book__results-loading"
          />
        </div>
        <router-link
          to="/add-book"
          class="add-book__manual d-flex jc-center ai-center gap-half"
          @click="addBookManually"
        >
          Add a book manually
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

import AddButtonIcon from "./icons/AddButtonIcon.vue";
import DefaultInput from "./forms/DefaultInput.vue";
import MagnifyLoader from "./icons/MagnifyLoader.vue";
import CloseIcon from "./icons/CloseIcon.vue";

export default {
  components: { AddButtonIcon, DefaultInput, MagnifyLoader, CloseIcon },
  data() {
    return {
      showOptions: false,
      searchTerm: "",
      results: [],
      resultsLoading: false,
      formFocused: false,
      timerId: null,
    };
  },
  computed: {
    showResults() {
      return this.searchTerm.length > 0 && !this.resultsLoading;
    },
  },
  watch: {
    searchTerm(newValue) {
      if (newValue.length) {
        clearTimeout(this.timerId);
        const newTimerId = setTimeout(() => {
          this.formFocused = true;
          this.searchForBook(newValue);
        }, 300);
        this.timerId = newTimerId;
      }
    },
  },
  methods: {
    ...mapMutations(["setBookToAdd", "setDetailedBook"]),
    ...mapActions(["searchBooks", "getBookToAdd"]),
    openAddBookOptions() {
      this.showOptions = !this.showOptions;
    },
    submitSearch(e) {
      e.preventDefault();
    },
    async searchForBook(term) {
      this.resultsLoading = true;
      this.results = await this.searchBooks(term);
      this.resultsLoading = false;
    },
    openBookResult(result) {
      console.log("🚀 ~ result", result);
      // this.getBookToAdd(result);
      // this.$router.push("/add-book");
      this.setDetailedBook(result);
      this.showOptions = !this.showOptions;
    },
    addBookManually() {
      this.setBookToAdd({});
      this.showOptions = !this.showOptions;
    },
  },
};
</script>

<style>
.add-book-button {
  position: fixed;
  right: var(--spacing-size-2);
  bottom: var(--spacing-size-2);
  height: 60px;
  width: 60px;
  border-radius: 50%;
  box-shadow: var(--box-shadow-1);
}
.add-book__icon {
  border-radius: 50%;
}
.add-book__icon circle {
  fill: var(--color-primary);
}
.add-book__icon line {
  stroke: var(--color-white);
}
.add-book__options {
  position: absolute;
  right: 15px;
  bottom: 70px;
  height: 0;
  width: 0;
  border-radius: 10px;
  background: var(--color-white);
  box-shadow: var(--box-shadow-1);
  overflow: hidden;
  transition: all 0.25s ease-in-out;
}
.add-book__options.open {
  height: 495px;
  width: 330px;
}
.add-book__options-list {
  height: 100%;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
}
.add-book__options.open .add-book__options-list {
  opacity: 1;
  transition: opacity 0.1s 0.15s ease-in-out;
}
.add-book__search-form {
  position: relative;
  margin: var(--spacing-size-2) var(--spacing-size-1) var(--spacing-size-1)
    var(--spacing-size-1);
}
.add-book__search-form input {
  padding-right: var(--spacing-size-3);
}
.add-book__search-clear-button {
  position: absolute;
  top: 15px;
  right: var(--spacing-size-1);
  height: 15px;
  width: 15px;
  cursor: pointer;
}
.add-book__results-list {
  overflow: auto;
}
.add-book__results-loading {
  height: 100px;
  width: 100px;
}
.add-book__result {
  padding: var(--spacing-size-half) var(--spacing-size-1);
}
.add-book__result:hover {
  background: var(--color-grey);
}
.add-book__result-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
.add-book__result-author {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.add-book__result-cover-placeholder {
  height: 100%;
  border: 1px solid var(--color-primary);
  border-radius: calc(var(--border-radius-1) / 2);
  background: var(--color-grey);
}
.add-book__result-cover {
  height: 50px;
  min-width: 50px;
  max-width: 50px;
  border-radius: calc(var(--border-radius-1) / 2);
  overflow: hidden;
}
.add-book__result-cover img {
  width: 100%;
  object-fit: cover;
  object-position: top left;
}
.add-book__manual {
  height: 50px;
  background: var(--color-primary);
  color: var(--color-white);
}
</style>
