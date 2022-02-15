<template>
  <section id="home" class="section-with-margin">
    <div class="home-shelves">
      <Shelf v-for="(shelf, i) in sortedShelves" :key="i" :shelf="shelf" />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Shelf from "./Shelf/Shelf.vue";

import shelf from "../helpers";

export default {
  components: {
    Shelf
  },
  computed: {
    ...mapGetters(["books", "shelves", "userProfile", "currentUser"]),
    inProgress: function() {
      if (this.books?.length) {
        let inProgressShelf = { ...shelf };
        inProgressShelf.id = "In Progress";
        const inProgressBook = this.books.find(b => {
          return b.inProgress;
        });
        if (inProgressBook) {
          inProgressShelf.name = "In Progress";
        }
        return inProgressShelf;
      } else {
        return { ...shelf };
      }
    },
    sortedShelves: function() {
      if (this.shelves) {
        const allShelves = this.shelves;
        let filteredShelves = allShelves.filter(s => {
          return this.books.find(b => {
            return b.shelves.includes(s.id);
          });
        });
        filteredShelves.sort((a, b) => {
          return a.inProgressShelf ? -1 : b.inProgressShelf ? 1 : 0;
        });
        return filteredShelves;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss">
section {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
}
#home h2 {
  margin-bottom: 1em;
  text-decoration: underline;
}
.home-shelves {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1025px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 4vw;
  }
}
</style>
