<template>
  <div
    v-if="detailedBook.id"
    class="detailed-book d-flex flex-column al-center"
  >
    <div class="d-flex w-100">
      <div class="detailed-book__cover d-flex jc-center mr-2 mb-3">
        <img :src="detailedBook.image" :alt="detailedBook.title" />
      </div>
      <div>
        <h2 class="detailed-book__title mb-1">{{ detailedBook.title }}</h2>
        <h3 class="detailed-book__author">by {{ detailedBook.author }}</h3>
        <p class="detailed-book__pages mb-2">
          {{ detailedBook.totalPages }} pages
        </p>
      </div>
    </div>
    <BookDetailsStats />
    <HistoryCard />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import BookDetailsStats from "./BookDetailsStats.vue";
import HistoryCard from "./HistoryCard.vue";

export default {
  components: {
    BookDetailsStats,
    HistoryCard,
  },
  props: {
    bookId: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["detailedBook"]),
  },
};
</script>

<style>
.detailed-book {
  position: fixed;
  top: 50%;
  left: 50%;
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
}
.detailed-book__cover {
  height: 225px;
}
.detailed-book__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
.detailed-book__title {
  font-size: var(--font-size-2);
}
.detailed-book__author {
  font-size: var(--font-size-1);
}
</style>
