<template>
  <div class="library-sidebar d-flex flex-column gap-3">
    <h2 class="px-1">Shelves</h2>
    <div>
      <ShelvesList />
      <hr class="my-2" />
      <form
        class="library-sidebar__create-shelf d-flex flex-column w-100"
        @submit.prevent="createShelf"
      >
        <DefaultInput
          id="create-shelf-name"
          v-model="newShelfName"
          placeholder="New shelf name"
          class="create-shelf__name w-100 mb-1"
        />
        <DefaultButton
          :disabled="!newShelfName"
          type="submit"
          text="Add shelf"
          flavor="tiny"
          color="blue"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import DefaultButton from "../buttons/DefaultButton.vue";
import ShelvesList from "./ShelvesList.vue";
import DefaultInput from "../forms/DefaultInput.vue";

export default {
  components: { DefaultButton, ShelvesList, DefaultInput },
  data() {
    return {
      createShelfFormOpen: false,
      newShelfName: "",
    };
  },
  computed: {
    ...mapGetters(["activeShelf"]),
  },
  methods: {
    ...mapMutations(["toggleModal", "setActiveShelf"]),
    ...mapActions(["addShelf"]),
    toggleCreateShelfForm() {
      this.createShelfFormOpen = !this.createShelfFormOpen;
    },
    async createShelf() {
      await this.addShelf(this.newShelfName);
      this.newShelfName = "";
    },
  },
};
</script>

<style>
.library-sidebar {
  min-width: 240px;
}
.library-sidebar__toggle-form-button {
  margin-left: auto;
}
</style>
