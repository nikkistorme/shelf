<template>
  <div class="book-details__shelves d-flex flex-wrap mb-2">
    <AddOptionButton
      v-if="shelfOptions.length > 0"
      :id="'add-book-to-shelf'"
      v-model="selectedShelf"
      input-name="add-book-to-shelf"
      :options="shelfOptions"
      :text="!detailedBook.shelves.length ? 'Add to a shelf' : ''"
    />
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { mapActions } from "vuex";
import { makeChange } from "../../services/changeService.js";

import CloseIcon from "../icons/CloseIcon.vue";
import AddOptionButton from "../buttons/AddOptionButton.vue";

export default {
  components: { CloseIcon, AddOptionButton },
  data() {
    return {
      selectedShelf: "",
    };
  },
  computed: {
    ...mapGetters(["shelves", "detailedBook", "getShelfById"]),
    shelfOptions() {
      let validShelves = this.shelves.filter((shelf) => {
        return (
          !shelf.inProgressShelf &&
          !shelf.allBooksShelf &&
          !shelf.finishedShelf &&
          !shelf.unreadShelf
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
    sanitizedShelves() {
      let shelves = this.detailedBook.shelves;
      return shelves;
    },
  },
  watch: {
    selectedShelf(newVal) {
      if (newVal) {
        this.addToShelf(newVal);
        this.selectedShelf = "";
      }
    },
  },
  methods: {
    ...mapActions(["addBookToShelf", "removeBookFromShelf"]),
    async removeFromShelf(shelfId) {
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
  },
};
</script>

<style>
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
</style>
