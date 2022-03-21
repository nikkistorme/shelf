<template>
  <div v-if="detailedBook.title" class="book-details as-center">
    <div
      class="book-details__close d-flex jc-center ai-center"
      @click="closeBookDetails"
    >
      <CloseIcon />
    </div>
    <div class="book-details__cover-container d-flex flex-column w-100">
      <div class="book-details__cover d-flex jc-center mb-2" @click="logBook">
        <img
          v-if="detailedBook.image"
          :src="detailedBook.image"
          :alt="detailedBook.title"
        />
        <div
          v-if="!detailedBook.image"
          class="book-details__cover-placeholder d-flex flex-column jc-space-between ai-center p-1"
        >
          <h5>{{ detailedBook.title }}</h5>
          <p>{{ detailedBook.author }}</p>
        </div>
      </div>
    </div>
    <BookDetailsTopInfo />
    <BookShelves v-if="detailedBook.id && !desktopLayout" />
    <div class="book-details__cards d-flex flex-column">
      <BookDetailsStats v-if="detailedBook.inProgress" />
      <DefaultButton
        v-if="detailedBook.id && !detailedBook.inProgress"
        text="Start reading"
        @click="startReading"
      />
      <BookDetailsDescription />
      <HistoryCard v-if="detailedBook.changes?.length > 0" />
    </div>
    <div class="book-details__options">
      <div
        v-if="detailedBook.id"
        class="book-details__remove d-flex flex-column jc-end ai-end gap-1 w-100"
      >
        <InlineButton
          text="Remove book from library"
          color="red"
          underline
          class="mt-1"
          @click="toggleRemoveBook"
        />
        <div v-if="removeBookConfirmation">
          <p>
            Are you sure you want to remove {{ detailedBook.title }} from your
            library? This action is not reversable.
          </p>
          <DefaultButton text="Remove" color="red" @click="removeBook" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { makeChange } from "../../services/changeService.js";

import BookDetailsStats from "./BookDetailsStats.vue";
import HistoryCard from "./HistoryCard.vue";
import InlineButton from "../buttons/InlineButton.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import BookShelves from "./BookShelves.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import BookDetailsTopInfo from "./BookDetailsTopInfo.vue";
import BookDetailsDescription from "./BookDetailsDescription.vue";

export default {
  components: {
    BookDetailsStats,
    HistoryCard,
    InlineButton,
    CloseIcon,
    BookShelves,
    DefaultButton,
    BookDetailsTopInfo,
    BookDetailsDescription,
  },
  props: {
    bookId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      removeBookConfirmation: false,
    };
  },
  computed: {
    ...mapGetters([
      "detailedBook",
      "updateProgressOpen",
      "updateGoalOpen",
      "getShelfById",
      "shelves",
      "detailedBookLoading",
    ]),
    desktopLayout() {
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      if (mediaQuery.matches) return true;
      return false;
    },
  },
  watch: {
    updateProgressOpen(newVal) {
      const updateProgressIsOpen = newVal;
      // If the update goal form is already open when the
      //   update progress form is opened, close it
      if (updateProgressIsOpen && this.updateGoalOpen) {
        this.setUpdateGoalVisible(false);
      }
      if (updateProgressIsOpen) {
        const targetScrollPosition = document.querySelector(
          ".book-details__stats .split-card-top"
        ).offsetTop;
        setTimeout(() => {
          document.querySelector(".book-details").scrollTop =
            targetScrollPosition;
        }, 300);
      } else if (!updateProgressIsOpen && !this.updateGoalOpen) {
        document.querySelector(".book-details").scrollTop = 0;
      }
    },
    updateGoalOpen(newVal) {
      const updateGoalFormIsOpen = newVal;
      // If the update progress form is already open when the
      //   update goal form is opened, close it
      if (updateGoalFormIsOpen && this.updateProgressOpen) {
        this.setUpdateProgressVisible(false);
      }
      if (updateGoalFormIsOpen) {
        const targetScrollPosition = document.querySelector(
          ".book-details__stats .split-card-top"
        ).offsetTop;
        setTimeout(() => {
          document.querySelector(".book-details").scrollTop =
            targetScrollPosition;
        }, 300);
      } else if (!updateGoalFormIsOpen && !this.updateProgressOpen) {
        document.querySelector(".book-details").scrollTop = 0;
      }
    },
  },
  methods: {
    ...mapMutations([
      "setUpdateGoalVisible",
      "setUpdateProgressVisible",
      "closeAllModals",
      "setDetailedBook",
    ]),
    ...mapActions([
      "deleteBook",
      "addBookToLibrary",
      "updateBookField",
      "startReadingBook",
    ]),
    logBook() {
      console.log(`${this.detailedBook.title}:`, this.detailedBook);
    },
    closeBookDetails() {
      this.closeAllModals();
      this.setDetailedBook({});
    },
    async addBook() {
      const addedBook = await this.addBookToLibrary(this.detailedBook);
      this.setDetailedBook(addedBook);
    },
    async startReading() {
      await this.startReadingBook({
        book: this.detailedBook,
        change: makeChange("startReading", {
          oldValue: false,
          newValue: true,
        }),
      });
    },
    toggleRemoveBook() {
      this.removeBookConfirmation = !this.removeBookConfirmation;
    },
    async removeBook() {
      await this.deleteBook(this.detailedBook);
    },
  },
};
</script>

<style>
.book-details {
  position: fixed;
  top: 50%;
  left: 50%;
  display: grid;
  transform: translate(-50%, -50%);
  max-height: 100vh;
  height: calc(100vh - var(--spacing-size-1) * 2);
  max-width: 900px;
  width: calc(100% - var(--spacing-size-1) * 2);
  padding: var(--spacing-size-3) var(--spacing-size-1);
  background-color: white;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-1);
  z-index: 1;
  overflow: auto;
  scroll-behavior: smooth;
}
.book-details__close {
  position: absolute;
  top: var(--spacing-size-half);
  right: var(--spacing-size-half);
  height: 40px;
  width: 40px;
  cursor: pointer;
}
.book-details__cover {
  height: 250px;
  max-width: 100%;
  overflow: hidden;
}
.book-details__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
.book-details__cover-placeholder {
  height: 250px;
  width: 175px;
  border-radius: 0 5px 5px 0;
  background-color: var(--color-grey);
  text-align: center;
}
.book-details__shelves {
  justify-content: center;
}
.book-details__remove {
  text-align: right;
}
.book-details__cards {
  display: grid;
  grid-gap: var(--spacing-size-2);
}
@media (min-width: 768px) {
  .book-details {
    grid-template-columns: 225px 1fr;
    grid-template-rows: min-content 1fr;
    grid-template-areas:
      "cover top"
      "cover cards"
      ". options"
      ". .";
    grid-gap: var(--spacing-size-2);
    padding: var(--spacing-size-3);
  }
  .book-details__cover-container {
    grid-area: cover;
    align-items: center;
  }
  .book-details__shelves {
    justify-content: start;
  }
  .book-details__cards {
    grid-area: cards;
  }
  .book-details__options {
    grid-area: options;
  }
}
</style>
