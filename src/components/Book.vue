<template>
  <div class="book">
    <div class="img" @click="openDrawer(book)">
      <img :src="book.image" :alt="book.title" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    openDrawer(book) {
      const newDrawer = {
        content: book,
        type: "inspectBook"
      };
      this.$store.commit("setDrawer", newDrawer);
    }
  }
};
</script>

<style lang="scss">
.book {
  padding-left: 1rem;
}
.img {
  position: relative;
  height: 200px;
  min-width: 134px;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: bottom;
  }
}
</style>
