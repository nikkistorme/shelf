<template>
  <div class="search-results-item" @click="addBook(book)">
    <div class="img-container">
      <img :src="book.image" :alt="book.title" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chosenShelf: null
    };
  },
  computed: {
    ...mapGetters(["currentUser", "shelves", "userProfile"])
  },
  methods: {
    addBook(book) {
      const newDrawer = {
        content: book,
        type: "addBook"
      };
      this.$store.commit("setDrawer", newDrawer);
    }
  }
};
</script>

<style lang="scss">
.search-results-item {
  position: relative;
  display: flex;
  overflow: hidden;
  height: 100px;
  width: 67px;
  padding: 5px;
  @media (min-width: 768px) {
    height: 205px;
    width: 128px;
    margin: 10px;
  }
  .book-info {
    width: 0;
    opacity: 0;
    padding: 0;
    white-space: nowrap;
    width: calc(258px - 58px);
    will-change: opacity;
    transition: all 0.3s ease;
    * {
      margin: 0;
    }
    @media (min-width: 768px) {
      padding: 10px;
    }
  }
  .img-container {
    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
      object-position: top right;
    }
  }
}
</style>
