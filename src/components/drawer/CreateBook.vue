<template>
  <form class="add_book" v-on:submit.prevent="addBook(book)">
    <textarea
      class="input image_input"
      name="image-url"
      v-model="book.image"
      placeholder="Image URL"
      cols="30"
      rows="10"
    />
    <input
      class="input full_width"
      v-model="book.title"
      type="text"
      placeholder="Title"
    />
    <input
      class="input full_width"
      v-model="book.author"
      type="text"
      placeholder="Author"
    />
    <div class="page_input full_width">
      <input
        name="total-pages"
        v-model="book.totalPages"
        class="input"
        type="number"
        pattern="\d*"
        placeholder="#"
      />
      <label for="total-pages">total pages</label>
    </div>
    <div class="page_input full_width">
      <input
        name="pages-read"
        v-model="book.readPages"
        class="input"
        type="number"
        pattern="\d*"
        placeholder="#"
      />
      <label for="pages-read">pages read</label>
    </div>
    <Multiselect
      v-model="selectedShelves"
      :options="shelves"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      :searchable="false"
      placeholder="Shelves"
      label="name"
      track-by="id"
    />
    <button
      class="gtm_add_book_submit black_button full_width"
      type="submit"
      :disabled="disableButton"
    >
      Add this Book
    </button>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import Multiselect from "vue-multiselect";

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  components: {
    Multiselect
  },
  data() {
    return {
      selectedShelves: []
    };
  },
  computed: {
    ...mapGetters(["shelves"]),
    disableButton: function() {
      const book = this.book;
      if (!book.title || !book.author || !book.totalPages) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    addBook(book) {
      console.log(`Adding ${book.title}`);
      book.readPages = Number.parseInt(book.readPages);
      book.totalPages = Number.parseInt(book.totalPages);
      if (!book.readPages) {
        book.inProgress = false;
        book.finished = "";
      } else if (book.totalPages > book.readPages) {
        book.inProgress = true;
        book.finished = "";
      } else if (book.readPages === book.totalPages) {
        book.inProgress = false;
        book.finished = Date.now();
      }
      console.log("🚀 ~ file: CreateBook.vue ~ line 96 ~ addBook ~ book", book);
      this.$store.dispatch("createBook", book).then(freshBook => {
        const newDrawer = {
          content: freshBook,
          type: "inspectBook"
        };
        this.$store.commit("setDrawer", newDrawer);
      });
    }
  },
  watch: {
    selectedShelves: function(newShelves) {
      this.book.shelves = newShelves.map(s => {
        return s.id;
      });
    }
  }
};
</script>

<style lang="scss">
.add_book {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  .black_button {
    margin-top: 2rem;
  }
}
.custom_select {
  select {
    width: 100%;
  }
}
</style>
