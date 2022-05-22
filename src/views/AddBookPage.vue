<template>
  <main
    class="add-book-page backdrop-illusion d-flex jc-center"
    @click="goBack"
  >
    <div class="add-book-page__content w-100">
      <div class="book-details__cover-container d-flex flex-column w-100">
        <div class="book-details__cover d-flex jc-center mb-2" @click="logBook">
          <img v-if="book.image" :src="book.image" :alt="book.title" />
          <div
            v-if="!book.image"
            class="book-details__cover-placeholder d-flex flex-column jc-space-between ai-center p-1"
          >
            <h5>{{ book.title }}</h5>
            <p>{{ book.author }}</p>
          </div>
        </div>
      </div>
      <form
        class="book-details__top-info d-flex flex-column gap-1 w-100"
        @submit.prevent="addBook"
      >
        <DefaultInput
          id="add-book-title"
          v-model="book.title"
          label="Title"
          :disabled="detailedBookLoading"
        />
        <DefaultInput
          id="add-book-author"
          v-model="book.author"
          :disabled="detailedBookLoading"
          label="Author"
        />
        <NumberInput
          id="add-book-total-pages"
          v-model="book.totalPages"
          :disabled="detailedBookLoading"
          label="Total pages"
        />
        <TextareaInput
          id="add-book-description"
          v-model="book.description"
          :disabled="detailedBookLoading"
          label="Description"
        />
        <DefaultButton
          v-if="!book.id && !detailedBookLoading"
          text="Add book to library"
          color="yellow"
          underline
          class="mt-1"
          :disabled="!book.title || !book.author || !book.totalPages"
          @click="addBook"
        />
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { bookSchema } from "../services/bookService.js";
import DefaultInput from "../components/forms/DefaultInput.vue";
import NumberInput from "../components/forms/NumberInput.vue";
import TextareaInput from "../components/forms/TextareaInput.vue";
import DefaultButton from "../components/buttons/DefaultButton.vue";

export default {
  components: { DefaultInput, NumberInput, TextareaInput, DefaultButton },
  data() {
    return {
      book: bookSchema(),
    };
  },
  computed: {
    ...mapGetters(["detailedBookLoading", "bookToAdd"]),
  },
  methods: {
    ...mapMutations(["setDetailedBook"]),
    ...mapActions(["addBookToLibrary"]),
    goBack(e) {
      if (e.target.classList.contains("backdrop-illusion")) {
        this.$router.go(-1);
      }
    },
    async addBook() {
      const addedBook = await this.addBookToLibrary(this.book);
      this.setDetailedBook(addedBook);
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.add-book-page__content {
  max-width: 900px;
  padding: var(--spacing-size-3) var(--spacing-size-1);
  margin: 0 var(--spacing-size-1) var(--spacing-size-1) var(--spacing-size-1);
  border-bottom-left-radius: var(--border-radius-1);
  border-bottom-right-radius: var(--border-radius-1);
  box-shadow: var(--box-shadow-2);
  clip-path: inset(0 -15px -15px -15px);
  background: var(--color-white);
}
</style>
