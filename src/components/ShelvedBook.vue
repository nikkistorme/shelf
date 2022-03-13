<template>
  <div class="shelved-book">
    <div class="shelved-book__cover" :class="location" @click="viewBookDetails">
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
    location: { type: String, default: "home" },
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
.home.shelved-book__cover {
  height: 250px;
}
.home.shelved-book__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
.library.shelved-book__cover {
  height: 100%;
}
.library.shelved-book__cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
</style>
