<template>
  <div class="add-book-button">
    <IconAddBook
      class="add-book__icon cursor-pointer h-100 w-100"
      @click="setBookSearchPopover()"
    />
    <div class="add-book__options" :class="showBookSearchPopover ? 'open' : ''">
      <div class="add-book__options-list d-flex flex-column jc-between">
        <div>
          <form class="add-book__search-form" @submit.prevent="submitSearch">
            <InputDefault
              v-model="searchTerm"
              class="add-book__search-form-input w-100"
              type="text"
              placeholder="Search books..."
            />
            <IconClose
              class="add-book__search-clear-button"
              @click="clearSearchTerm"
            />
          </form>
          <ul
            v-if="results.length && !resultsLoading"
            class="add-book__results-list d-flex flex-column"
          >
            <li
              v-for="(result, i) in results"
              :key="i"
              class="add-book__result d-flex gap-1 px-1 cursor-pointer"
              @click="viewBook(result)"
            >
              <div class="add-book__result-cover">
                <img
                  v-if="result.cover"
                  :src="result.cover"
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
          <IconMagnifyLoader
            v-if="resultsLoading"
            class="add-book__results-loading"
          />
        </div>
        <NuxtLink
          to="/books/add"
          class="add-book__manual d-flex jc-center ai-center gap-half"
          @click="setBookSearchPopover()"
        >
          Add a book manually
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { searchBooks, searchGoogleBooks } from "~/services/bookService";
import { useBookStore } from "~~/store/BookStore";

export default {
  setup() {
    const showBookSearchPopover = ref(false);

    function setBookSearchPopover() {
      if (!showBookSearchPopover.value) {
        showBookSearchPopover.value = true;
        document.querySelector(".add-book__search-form-input input").focus();
      } else {
        showBookSearchPopover.value = false;
      }
    }

    const searchInput = ref(null);
    const searchTerm = ref("");
    function submitSearch() {
      e.preventDefault();
    }
    function clearSearchTerm() {
      searchTerm.value = "";
      document.querySelector(".add-book__search-form-input input").focus();
    }

    const timerId = ref(null);
    const formFocused = ref(false);
    watch(searchTerm, (newValue) => {
      if (newValue?.length) {
        clearTimeout(timerId.value);
        const newTimerId = setTimeout(() => {
          formFocused.value = true;
          searchForBook(newValue);
        }, 300);
        timerId.value = newTimerId;
      }
    });

    const results = ref([]);
    const resultsLoading = ref(false);
    async function searchForBook(query) {
      resultsLoading.value = true;
      let searchResults;
      searchResults = await searchBooks(query);
      if (searchResults.length < 5) {
        const neededResults = 5 - searchResults.length;
        const googleResults = await searchGoogleBooks(query, neededResults);
        searchResults = searchResults.concat(googleResults);
      }
      results.value = searchResults;
      resultsLoading.value = false;
    }

    const router = useRouter();
    const bookStore = useBookStore();
    async function viewBook(book) {
      if (book.id) {
        await router.push(`/books/${book.id}`);
        const fullPathPieces = router.currentRoute.value.fullPath.split("/");
        const finalPathPiece = fullPathPieces[fullPathPieces.length - 1];
        if (finalPathPiece === book.id.toString())
          showBookSearchPopover.value = false;
      } else {
        bookStore.bookToAdd = book;
        await router.push(`/books/add`);
        showBookSearchPopover.value = false;
      }
      searchTerm.value = "";
    }

    return {
      showBookSearchPopover,
      setBookSearchPopover,
      searchInput,
      searchTerm,
      clearSearchTerm,
      submitSearch,
      results,
      resultsLoading,
      viewBook,
    };
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
  z-index: var(--z-index-add-book-button);
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
