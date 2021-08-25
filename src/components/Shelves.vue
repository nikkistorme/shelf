<template>
  <section id="read" class="section-with-margin">
    <select
      name="selectShelf"
      v-model="chosenShelf"
      @change="updateActiveShelf"
    >
      <option :value="{}">All Books</option>
      <option v-for="(shelf, i) in shelves" :key="i" :value="shelf.id">
        {{ shelf.name }}
      </option>
    </select>
    <div class="shelf-contents">
      <ShelvedVolume
        v-for="(book, i) in booksOnChosenShelf"
        :key="i"
        :book="book"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import ShelvedVolume from "./ShelvedVolume.vue";

export default {
  components: {
    ShelvedVolume
  },
  data() {
    return {
      chosenShelf: ""
    };
  },
  computed: {
    ...mapGetters(["books", "shelves", "userProfile", "currentUser"]),
    booksOnChosenShelf: function() {
      if (
        this.chosenShelf?.length &&
        this.shelves?.length &&
        this.books?.length
      ) {
        console.log("1");
        console.log('this.shelves', this.shelves);
        console.log('this.chosenShelf', this.chosenShelf);
        console.log('this.books', this.books);
        const chosenShelfObject = this.shelves.find(
          s => s.id === this.chosenShelf
        );
        console.log('chosenShelfObject', chosenShelfObject);
        const books = chosenShelfObject.books.map(bookId => {
          return this.books.find(b => b.id === bookId);
        });
        console.log("books", books);
        return books;
      } else if (this.books.length) {
        console.log("2");
        return this.books;
      } else {
        console.log("3");
        return [];
      }
    }
  },
  methods: {
    ...mapMutations(["setUserProfile"]),
    updateActiveShelf() {
      console.log("udpating active shelf");
      this.userProfile.activeShelf = this.chosenShelf;
      this.$store.dispatch("updateUser", this.userProfile);
    }
  },
  watch: {
    userProfile: function(newUser) {
      this.chosenShelf = newUser.activeShelf;
    }
  }
};
</script>

<style lang="scss">
#read {
  display: flex;
  flex-direction: column;
  .shelf-contents {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }
  .volume {
    padding: 10px;
  }
  .movie-poster {
    display: flex;
    width: 128px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
}
</style>
