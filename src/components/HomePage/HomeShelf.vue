<template>
  <div class="home-shelf d-flex flex-column jc-end w-100">
    <div class="home-shelf__books d-flex jc-start w-100">
      <ShelvedBook
        v-for="(book, i) in booksOnThisShelf"
        :key="i"
        :book="book"
      />
    </div>
    <div class="home-shelf__floor d-flex jc-space-between w-100">
      <h5 class="home-shelf__name">{{ shelf.name }}</h5>
      <div v-if="shelf.sort" class="home-shelf__sort d-flex ai-center">
        <SelectInput
          :id="`shelf-sort__${shelf.id}`"
          v-model="shelf.sort.method"
          class="home-shelf__sort-method"
          :options="sortOptions"
          inline
          no-carrot
          align="right"
          @change="changeSortMethod"
        />
        <div
          class="home-shelf__sort-direction d-flex jc-center ai-center"
          :class="{ ascending: !shelf.sort.descending }"
          @click="changeSortDirection"
        >
          <ArrowDown />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import ShelvedBook from "../ShelvedBook.vue";
import ArrowDown from "../icons/ArrowDown.vue";

import { sortShelfByMethod } from "../../services/shelfSortingService.js";
import SelectInput from "../forms/SelectInput.vue";

export default {
  components: { ShelvedBook, ArrowDown, SelectInput },
  props: {
    shelfId: { type: String, default: "" },
    inProgress: { type: Boolean, default: false },
  },
  emits: ["update:shelf"],
  data() {
    return {
      sortOptions: [
        {
          value: "date-added-to-library",
          label: "Date Added",
        },
        {
          value: "date-started",
          label: "Date Started",
        },
        {
          value: "percent-complete",
          label: "Progress",
        },
        {
          value: "last-updated-progress",
          label: "Last Updated Progress",
        },
        {
          value: "date-added-to-shelf",
          label: "Date Added to Shelf",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["books", "getShelfById", "inProgressBooks"]),
    shelf() {
      return this.getShelfById(this.shelfId);
    },
    booksOnThisShelf() {
      let books = [];
      if (this.inProgress) {
        books = this.inProgressBooks;
      } else if (this?.shelf?.id && this.books.length) {
        books = this.books.filter((book) =>
          book.shelves.includes(this.shelf.id)
        );
      }
      books.sort((a, b) => sortShelfByMethod(a, b, this.shelf));
      return books;
    },
  },
  methods: {
    ...mapActions(["updateShelfSort"]),
    async changeSortMethod() {
      await this.updateShelfSort(this.shelf);
    },
    async changeSortDirection() {
      this.shelf.sort.descending = !this.shelf.sort.descending;
      await this.updateShelfSort(this.shelf);
    },
  },
};
</script>

<style>
@media (min-width: 768px) and (max-width: 1023px) {
  .home-shelf {
    grid-column: 1 / -1;
  }
}
.home-shelf__books {
  padding: calc(var(--spacing-size-1) / 4);
  overflow-x: auto;
  overflow-y: hidden;
}
.home-shelf__floor {
  position: relative;
  padding: calc(var(--spacing-size-1) / 4) var(--spacing-size-1);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.3);
}
.home-shelf__sort-method {
  margin-right: 20px;
  border: none;
  background: none;
  text-align: right;
}
.home-shelf__sort-direction {
  position: absolute;
  right: 0;
  height: 100%;
  width: 40px;
  cursor: pointer;
}
.home-shelf__sort-direction svg {
  height: 10px;
  width: 10px;
}
.home-shelf__sort-direction.ascending svg {
  transform: rotate(180deg);
}
</style>
