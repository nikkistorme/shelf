<template>
  <section id="home" class="section-with-margin">
    <h2>{{ inProgressShelf.name }}</h2>
    <InProgressVolume
      v-for="(volume, i) in inProgressShelf.volumes"
      :key="i"
      :volume="volume"
    />
  </section>
</template>

<script>
import { cloneDeep as _cloneDeep } from "lodash";
import { mapGetters } from "vuex";
import InProgressVolume from "./InProgressVolume.vue";

const sortVolumes = (a, b) => {
  if (a.goalDate !== "0000-00-00" && b.goalDate !== "0000-00-00") {
    return a.goalDate > b.goalDate;
  } else if (a.goalDate !== "0000-00-00") {
    return -1;
  } else if (b.goalDate !== "0000-00-00") {
    return 1;
  } else {
    return 0;
  }
};

export default {
  components: {
    InProgressVolume
  },
  data() {
    return { editMode: false };
  },
  computed: {
    ...mapGetters(["userProfile", "currentUser"]),
    inProgressShelf: function() {
      if (this.userProfile.name) {
        let shelf = _cloneDeep(
          this.userProfile.shelves.find(s => s.id === "default-reading")
        );
        shelf.volumes.sort((a, b) => sortVolumes(a, b));
        return shelf;
      } else {
        return {};
      }
    }
  }
};
</script>

<style lang="scss">
#home h2 {
  margin-bottom: 1em;
  text-decoration: underline;
}
</style>
