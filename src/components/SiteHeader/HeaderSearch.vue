<template>
  <div class="header-search w-100">
    <form ref="bookSearchForm" @submit.prevent="submitSearch">
      <DefaultInput
        v-model="searchTerm"
        class="w-100"
        type="text"
        placeholder="Search books..."
      />
    </form>
    <ul v-if="showResults" class="header-search__results">
      <div
        v-if="results.length > 0 && !resultsLoading"
        class="d-flex flex-column"
      >
        <li
          v-for="(result, i) in results"
          :key="i"
          class="header-search__result d-flex gap-1 px-1 cursor-pointer"
          @click="openBookResult(result)"
        >
          <div class="header-search__result-cover">
            <img v-if="result.image" :src="result.image" :alt="result.title" />
            <div v-else class="header-search__result-cover-placeholder"></div>
          </div>
          <div>
            <p class="header-search__result-title">
              {{ result.title }}
            </p>
            <p class="header-search__result-author">by {{ result.author }}</p>
          </div>
        </li>
      </div>
      <li v-if="results.length === 0 && !resultsLoading" class="px-1">
        <p>No results found</p>
      </li>
      <li v-if="resultsLoading" class="px-1">
        <p>Loading...</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import DefaultInput from "../forms/DefaultInput.vue";

export default {
  components: { DefaultInput },
  data() {
    return {
      searchTerm: "",
      results: [],
      resultsLoading: false,
      formFocused: false,
    };
  },
  computed: {
    ...mapGetters(["modalOpen", "searchResultsOpen"]),
    showResults() {
      return this.searchTerm.length > 0 && this.searchResultsOpen;
    },
  },
  watch: {
    searchTerm(newValue) {
      if (newValue.length) {
        this.formFocused = true;
        this.setSearchResultsOpen(true);
        this.searchForBook(newValue);
      } else {
        this.setSearchResultsOpen(false);
      }
    },
  },
  methods: {
    ...mapMutations(["setDetailedBook", "setSearchResultsOpen"]),
    ...mapActions(["searchBooks"]),
    blurForm() {
      const form = this.$refs.bookSearchForm;
      let formInput = null;
      if (form) {
        formInput = form.querySelector("input[type=text]");
      }
      const focused = document.activeElement === formInput;
      this.formFocused = focused;
    },
    async searchForBook(term) {
      this.resultsLoading = true;
      this.results = await this.searchBooks(term);
      this.resultsLoading = false;
    },
    submitSearch(e) {
      console.log("🚀 ~ e", e);
      e.preventDefault();
    },
    openBookResult(result) {
      this.searchTerm = "";
      this.setDetailedBook(result);
    },
  },
};
</script>

<style>
.header-search {
  position: relative;
  max-width: 350px;
}
.header-search__results {
  position: absolute;
  right: 0;
  width: 100%;
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  background: white;
  z-index: 1;
  overflow: hidden;
}
.header-search__result {
  padding-top: var(--spacing-size-half);
  padding-bottom: var(--spacing-size-half);
  transition: all 0.15s ease-in-out;
}
.header-search__result:hover {
  background: var(--color-grey);
}
.header-search__result-cover {
  height: 75px;
  min-width: 50px;
  max-width: 50px;
  overflow: hidden;
}
.header-search__result-cover img {
  height: 100%;
  object-fit: contain;
  object-position: left;
}
.header-search__result-cover-placeholder {
  height: 100%;
  border: 2px solid var(--color-primary);
  border-radius: calc(var(--border-radius-1) / 2);
  background: var(--color-grey);
}
.header-search__result-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
@media (min-width: 768px) {
  .header-search__results {
    right: 0;
  }
}
</style>
