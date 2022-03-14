<template>
  <div v-if="detailedBook.id" class="book-details">
    <div
      class="book-details__close d-flex jc-center ai-center"
      @click="closeBookDetails"
    >
      <CloseIcon />
    </div>
    <div
      class="book-details__cover-container d-flex flex-column ai-center w-100"
    >
      <div class="book-details__cover d-flex jc-center mb-2">
        <img :src="detailedBook.image" :alt="detailedBook.title" />
      </div>
    </div>
    <div class="book-details__top-info d-flex flex-column jc-center mb-1">
      <h2 class="book-details__title mb-1">{{ detailedBook.title }}</h2>
      <h3 class="book-details__author">by {{ detailedBook.author }}</h3>
      <p class="book-details__pages">{{ detailedBook.totalPages }} pages</p>
    </div>
    <div class="book-details__shelves d-flex jc-center mb-2">
      <div
        v-for="(shelf, i) in detailedBook.shelves"
        :key="i"
        class="book-details__shelf d-flex ai-center"
      >
        <p>
          {{ getShelfById(shelf).name }}
        </p>
        <div
          class="book-details__remove-from-shelf d-flex cursor-pointer"
          @click="removeFromShelf(shelf)"
        >
          <CloseIcon class="w-100 h-100" color="red" />
        </div>
      </div>
      <AddOptionButton
        v-if="shelfOptions.length > 0"
        :id="'add-book-to-shelf'"
        v-model="selectedShelf"
        input-name="add-book-to-shelf"
        :options="shelfOptions"
        :text="!detailedBook.shelves.length ? 'Add to a shelf' : ''"
      />
    </div>
    <div class="book-details__cards">
      <BookDetailsStats v-if="detailedBook.inProgress" />
      <div class="book-details__description card">
        <p
          class="book-details__description-text"
          :class="{ expanded: expandDescription }"
        >
          {{ detailedBook.description }}
        </p>
        <InlineButton
          class="book-details__description-expand"
          :text="expandDescription ? 'show less' : 'show more'"
          underline
          color="blue"
          @click="toggleDescription"
        />
      </div>
      <HistoryCard />
    </div>
    <div class="book-details__remove d-flex w-100">
      <InlineButton
        text="Remove book from library"
        color="red"
        underline
        class="mt-1"
        @click="removeBook"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
import { makeChange } from "../../services/changeService.js";

import BookDetailsStats from "./BookDetailsStats.vue";
import HistoryCard from "./HistoryCard.vue";
import InlineButton from "../buttons/InlineButton.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import AddOptionButton from "../buttons/AddOptionButton.vue";

export default {
  components: {
    BookDetailsStats,
    HistoryCard,
    InlineButton,
    CloseIcon,
    AddOptionButton,
  },
  props: {
    bookId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      expandDescription: false,
      selectedShelf: "",
    };
  },
  computed: {
    ...mapGetters([
      "detailedBook",
      "updateProgressOpen",
      "updateGoalOpen",
      "getShelfById",
      "shelves",
    ]),
    shelfOptions() {
      let validShelves = this.shelves.filter((shelf) => {
        return (
          !shelf.inProgressShelf && !shelf.allBooksShelf && !shelf.finishedShelf
        );
      });
      validShelves = validShelves.filter((shelf) => {
        return !this.detailedBook.shelves.includes(shelf.id);
      });
      return validShelves.map((shelf) => ({
        value: shelf.id,
        label: shelf.name,
      }));
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
    selectedShelf(newVal) {
      if (newVal) {
        this.addToShelf(newVal);
        this.selectedShelf = "";
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
    ...mapActions(["removeBook", "addBookToShelf", "removeBookFromShelf"]),
    toggleDescription() {
      this.expandDescription = !this.expandDescription;
    },
    async addToShelf(shelfId) {
      await this.addBookToShelf({
        book: this.detailedBook,
        change: makeChange("addToShelf", {
          oldValue: null,
          newValue: shelfId,
          fields: {
            shelfName: this.getShelfById(shelfId).name,
          },
        }),
      });
    },
    async removeFromShelf(shelfId) {
      console.log("🚀 ~ shelfId", shelfId);
      await this.removeBookFromShelf({
        book: this.detailedBook,
        change: makeChange("removeFromShelf", {
          oldValue: shelfId,
          newValue: null,
          fields: {
            shelfName: this.getShelfById(shelfId).name,
          },
        }),
      });
    },
    closeBookDetails() {
      this.closeAllModals();
      this.setDetailedBook({});
    },
    removeBook() {
      console.log("remove book");
      // this.removeBook(this.detailedBook.id);
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
  height: calc(100vh - (var(--spacing-size-1) * 2));
  width: calc(100vw - (var(--spacing-size-1) * 2));
  padding: var(--spacing-size-3) var(--spacing-size-1);
  margin-top: calc(-1 * (100vh - (var(--spacing-size-1) * 2)) / 2);
  margin-left: calc(-1 * (100vw - (var(--spacing-size-1) * 2)) / 2);
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
}
.book-details__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
.book-details__top-info {
  justify-self: center;
  width: fit-content;
}
.book-details__title {
  font-size: var(--font-size-2);
}
.book-details__author {
  font-size: var(--font-size-1);
}
.book-details__shelves {
  gap: var(--spacing-size-half);
}
.book-details__shelf {
  gap: var(--spacing-size-half);
  padding: 0 calc((var(--spacing-size-half)));
  border-radius: var(--border-radius-2);
  border: 2px solid var(--color-primary);
}
.book-details__remove-from-shelf {
  height: 13px;
  width: 13px;
}
.book-details__description {
  position: relative;
}
.book-details__description-text:not(.expanded) {
  max-height: calc(var(--line-height-1) * 6);
  overflow: hidden;
}
.book-details__description-expand {
  position: absolute;
  right: var(--spacing-size-2);
  bottom: 4px;
  height: fit-content;
  padding-left: var(--spacing-size-1) !important;
  background: white !important;
}
.book-details__remove {
  justify-content: flex-end;
}
.book-details__cards {
  display: grid;
  grid-gap: var(--spacing-size-2);
}
@media (min-width: 768px) {
  .book-details {
    grid-template-columns: 275px 1fr;
    grid-template-rows: min-content fit-content;
    grid-template-areas:
      "cover top"
      "cover cards"
      "remove cards";
    grid-gap: var(--spacing-size-2);
    padding: var(--spacing-size-3);
  }
  .book-details__cover-container {
    grid-area: cover;
  }
  .book-details__top-info {
    grid-area: top;
    align-self: start;
    width: 100%;
  }
  .book-details__title {
    font-size: var(--font-size-3);
  }
  .book-details__author {
    font-size: var(--font-size-2);
    font-weight: normal;
  }
  .book-details__cards {
    grid-area: cards;
    display: grid;
  }
}
@media (min-width: 1200px) {
  .book-details__cards {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "description stats"
      "history stats"
      "history stats";
    grid-gap: var(--spacing-size-2);
  }
  .book-details__stats {
    grid-area: stats;
  }
  .book-details__description {
    grid-area: description;
    height: min-content;
  }
  .history-card {
    grid-area: history;
  }
  .book-details__remove {
    grid-area: remove;
    justify-content: flex-start;
    align-items: flex-end;
  }
}
</style>
