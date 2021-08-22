<template>
  <section id="home" class="section-with-margin">
    <Shelf v-for="(shelf, i) in sortedShelves" :key="i" :shelf="shelf" />
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Shelf from "./Shelf.vue";

export default {
  components: {
    Shelf
  },
  data() {
    return { editMode: false };
  },
  computed: {
    ...mapGetters(["userProfile", "currentUser"]),
    sortedShelves: function() {
      if (this.userProfile.shelves) {
        const allShelves = this.userProfile.shelves;
        const filteredShelves = allShelves.filter(s => {
          return s.volumes.length > 0;
        });
        const sortedShelves = filteredShelves.sort((a, b) => {
          if (a.id === 'default-reading') {
            return -1;
          } else if (a.volumes.length > b.volumes.length) {
            return -1;
          } else if (a.volumes.length < b.volumes.length) {
            return 1;
          } else return 0;
        });
        return sortedShelves;
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
</style>
