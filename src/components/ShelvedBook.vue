<template>
  <div class="shelved-book">
    <div class="shelved-book__cover" :class="location" @click="viewBookDetails">
      <img v-if="book.image" :src="book.image" :alt="book.title" />
      <div
        v-if="!book.image"
        class="shelved-book__cover-placeholder d-flex flex-column jc-space-between ai-center p-1"
      >
        <h5>{{ book.title }}</h5>
        <p>{{ book.author }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

export default {
  props: {
    book: { type: Object, default: () => ({}) },
    location: { type: String, default: "home" },
  },
  computed: {
    ...mapGetters(["modalOpen", "detailedBook"]),
  },
  methods: {
    ...mapMutations(["setDetailedBook"]),
    ...mapActions(["getDetailedBook"]),
    async viewBookDetails() {
      await this.getDetailedBook(this.book.id);
    },
  },
};
</script>

<style>
.shelved-book__cover img {
  border-radius: 0 5px 5px 0;
  object-fit: contain;
  object-position: bottom;
}
.home.shelved-book__cover {
  height: 250px;
  max-width: 400px;
  overflow: hidden;
}
.home.shelved-book__cover img {
  height: 100%;
  object-fit: contain;
  object-position: bottom;
}
.library.shelved-book__cover {
  display: flex;
  align-items: end;
  height: 100%;
}
.library.shelved-book__cover img {
  width: 100%;
  height: min-content;
}
.shelved-book__cover-placeholder {
  border-radius: 0 5px 5px 0;
  background-color: var(--color-grey);
  text-align: center;
}
.home .shelved-book__cover-placeholder {
  height: 250px;
  width: 175px;
}
</style>
