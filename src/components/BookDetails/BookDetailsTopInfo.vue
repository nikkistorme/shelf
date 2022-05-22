<template>
  <form
    class="book-details__top-info d-flex flex-column jc-center mb-1"
    @submit.prevent="updateField"
  >
    <div class="book-details__title d-flex ai-center gap-1 mb-1">
      <h2>{{ book.title }}</h2>
    </div>
    <h3 class="book-details__author">by {{ book.author }}</h3>
    <div
      class="book-details__pages pencil-hover-container d-flex flex-column mb-1"
    >
      <div class="d-flex gap-1">
        <p>{{ book.totalPages }} pages</p>
        <EditPencil
          v-if="book.id"
          v-show="editingField !== 'totalPages'"
          @click="editField('totalPages')"
        />
      </div>
      <div
        v-if="editingField === 'totalPages'"
        class="book-details__pages-edit d-flex ai-center gap-1"
      >
        <NumberInput v-model="editingFieldValue" />
        <CloseIcon color="red" class="cursor-pointer" @click="editField('')" />
        <CheckmarkIcon
          class="book-details__pages-edit-confirm cursor-pointer"
          @click="updateField"
        />
      </div>
    </div>
    <DefaultButton
      v-if="!book.id && !detailedBookLoading"
      text="Add book to library"
      color="yellow"
      underline
      class="mt-1"
      @click="addBook"
    />
    <p v-if="!book.id && detailedBookLoading">Adding book...</p>
    <BookShelves v-if="book.id && desktopLayout" />
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
import { makeChange } from "../../services/changeService.js";

import EditPencil from "../icons/EditPencil.vue";
import NumberInput from "../forms/NumberInput.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import CheckmarkIcon from "../icons/CheckmarkIcon.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import BookShelves from "./BookShelves.vue";

export default {
  components: {
    EditPencil,
    NumberInput,
    CloseIcon,
    CheckmarkIcon,
    DefaultButton,
    BookShelves,
  },
  props: {
    page: {
      type: String,
      default: "detailedBook",
    },
  },
  data() {
    return {
      editingField: "",
      editingFieldValue: null,
    };
  },
  computed: {
    ...mapGetters(["detailedBook", "detailedBookLoading", "bookToAdd"]),
    book() {
      switch (this.page) {
        case "detailedBook":
          return this.detailedBook;
        case "addBook":
          return this.bookToAdd;
        default:
          return this.detailedBook;
      }
    },
    desktopLayout() {
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      if (mediaQuery.matches) return true;
      return false;
    },
  },
  methods: {
    ...mapMutations(["setDetailedBook", "setBookToAdd"]),
    ...mapActions(["updateBookField", "addBookToLibrary"]),
    editField(field) {
      this.editingField = field;
      this.editingFieldValue = this.detailedBook[field];
    },
    async updateField() {
      await this.updateBookField({
        book: this.detailedBook,
        change: makeChange("updateField", {
          oldValue: this.detailedBook[this.editingField],
          newValue: this.editingFieldValue,
          field: this.editingField,
        }),
        field: this.editingField,
      });
      this.editingField = null;
    },
    async addBook() {
      const addedBook = await this.addBookToLibrary(this.detailedBook);
      this.setBookToAdd({});
      this.setDetailedBook(addedBook);
    },
  },
};
</script>

<style>
.book-details__top-info {
  justify-self: start;
  width: fit-content;
}
.book-details__title {
  font-size: var(--font-size-2);
}
.book-details__author {
  font-size: var(--font-size-1);
}
.book-details__pages-edit-confirm {
  height: 30px;
  width: 30px;
}
@media (min-width: 768px) {
  .book-details__top-info {
    grid-area: top;
    align-self: start;
  }
  .book-details__author {
    font-size: var(--font-size-2);
    font-weight: normal;
  }
}
</style>
