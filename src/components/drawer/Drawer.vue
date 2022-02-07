<template>
  <div>
    <div class="drawer" :class="{ open: drawer.open }">
      <div @click="close" class="close_drawer_button">
        <font-awesome-icon icon="times" />
      </div>
      <CreateBook v-if="drawer.type === 'addBook'" :book="drawer.content" />
      <InspectBook
        v-if="drawer.type === 'inspectBook'"
        :bookId="drawer.content.id"
      />
      <Navigation v-if="drawer.type === 'nav'" />
    </div>
    <div
      class="drawer-overlay"
      :class="{ open_drawer: drawer.open }"
      @click="close"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import InspectBook from "./InspectBook";
import CreateBook from "./CreateBook";
import Navigation from "./Navigation";

export default {
  components: {
    InspectBook,
    CreateBook,
    Navigation
  },
  data() {
    return {
      editMode: false,
      newPage: -1
    };
  },
  computed: {
    ...mapGetters(["drawer"])
  },
  methods: {
    ...mapMutations(["closeDrawer"]),
    test() {
      console.log("drawer", this.drawer);
    },
    close() {
      this.$store.commit("closeDrawer");
    }
  }
};
</script>

<style lang="scss">
.drawer {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 10;
  top: 0;
  background-color: #fff;
  overflow-x: hidden;
  transition: width 0.5s;
}
.open {
  transition: all 0.5s;
  width: 100%;
  .top_level_info {
    opacity: 1;
  }
}
.close_drawer_button {
  position: absolute;
  right: 7px;
  cursor: pointer;
  font-size: 30px;
}
.open_drawer {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
.update-page {
  display: flex;
  margin-top: 5px;
  &-button {
    height: 30px;
    border: none;
    padding: 0;
    font-size: 18px;
    outline: none;
    background: none;
  }
  &-input {
    max-width: 75px;
    margin-left: 5px;
  }
}
</style>
