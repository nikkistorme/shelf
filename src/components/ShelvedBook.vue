<template>
  <div class="shelved-book">
    <div class="shelved-book__cover" @click="viewBookDetails">
      <img :src="book.image" :alt="book.title" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  props: {
    book: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapGetters(["modalOpen", "detailedBook"]),
  },
  methods: {
    ...mapMutations(["toggleModal", "setDetailedBook"]),
    viewBookDetails() {
      this.toggleModal();
      this.$store.dispatch("getDetailedBook", this.book.id);
    },
  },
};
</script>

<style>
.shelved-book {
  margin-left: var(--spacing-size-1);
}
.shelved-book__cover {
  height: 250px;
}
/* @media (min-width: 1350px) {
  .shelved-book__cover {
    height: 245px;
  }
} */
.shelved-book__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
</style>
