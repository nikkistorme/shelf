<template>
  <section id="read" class="section-with-margin">
    <select name="selectShelf" v-model="chosenShelf">
      <option :value="null">Choose a Shelf</option>
      <option
        v-for="(shelf, i) in userProfile.shelves"
        :key="i"
        :value="shelf.id"
        >{{ shelf.name }}</option
      >
    </select>
    <div class="shelf-contents">
      <ShelvedVolume
        v-for="(volume, i) in fullShelf.volumes"
        :key="i"
        :book="volume"
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
      chosenShelf: "default-reading"
    };
  },
  computed: {
    ...mapGetters(["userProfile", "currentUser"]),
    fullShelf: function() {
      // make sure to not compute until profile comes back from Firebase
      if (this.userProfile.name) {
        return this.userProfile.shelves.find(s => s.id === this.chosenShelf);
      } else {
        return [];
      }
    }
  },
  watch: {
    chosenShelf: function(newShelf) {
      console.log("changed shelf");
      this.$store.commit("setCurrentShelf", newShelf);
    }
  },
  methods: {
    ...mapMutations(["setCurrentShelf"]),
    test() {
      console.log("test");
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
