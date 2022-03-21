<template>
  <div class="shelf-title">
    <div
      class="shelf-title__select-wrapper d-flex ai-center"
      @click="toggleShelfSelect"
    >
      <div
        class="shelf-title__select-icon d-flex flex-column jc-space-around mr-1"
      >
        <ArrowDown class="up" />
        <ArrowDown class="down" />
      </div>
      <h2 class="shelf-title__name">{{ activeShelf.name }}</h2>
    </div>
    <!-- <EditPencil /> -->
    <div
      class="shelf-title__shelf-dropdown dropdown-modal-menu flex-column"
      :class="{ open: libraryShelfSelectOpen }"
    >
      <div
        class="shelf-title__shelf-dropdown-wrapper d-flex flex-column ai-end p-1 pt-2"
      >
        <ShelvesList />
        <hr class="my-2" />
        <DefaultButton
          :text="createShelfFormOpen ? 'Cancel' : 'New shelf'"
          flavor="tiny"
          :color="createShelfFormOpen ? 'red' : 'blue'"
          class="w-fit-content"
          @click="toggleCreateShelfForm"
        />
        <form
          class="create-shelf d-flex flex-column ai-end w-100"
          :class="{ open: createShelfFormOpen }"
          @submit.prevent="createShelf"
        >
          <DefaultInput
            id="create-shelf-name"
            v-model="newShelfName"
            label="Name"
            class="create-shelf__name w-100 mb-1"
          />
          <DefaultButton
            type="submit"
            text="Create"
            flavor="tiny"
            color="blue"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import ArrowDown from "../icons/ArrowDown.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import DefaultInput from "../forms/DefaultInput.vue";
import ShelvesList from "./ShelvesList.vue";
import EditPencil from "../icons/EditPencil.vue";

// const addHeightForNewShelf = () => {
//   const outerDropdown = document.querySelector(".shelf-title__shelf-dropdown");
//   const shelfList = document.querySelector(".shelf-title__dropdown-list");
//   console.log("🚀 ~ shelfList", shelfList);
//   if (shelfList.clientHeight < 450) {
//     outerDropdown.style.height = outerDropdown.clientHeight + 41.88 + "px";
//   }
// };

export default {
  components: {
    ArrowDown,
    DefaultButton,
    DefaultInput,
    ShelvesList,
    EditPencil,
  },
  data() {
    return {
      createShelfFormOpen: false,
      newShelfName: "",
    };
  },
  computed: {
    ...mapGetters(["libraryShelfSelectOpen", "activeShelf"]),
  },
  watch: {
    libraryShelfSelectOpen(newValue) {
      if (newValue) {
        const outerDropdown = document.querySelector(
          ".shelf-title__shelf-dropdown"
        );
        const innerDropdown = document.querySelector(
          ".shelf-title__shelf-dropdown-wrapper"
        );

        outerDropdown.style.height = innerDropdown.scrollHeight + "px";
      } else {
        document.querySelector(".shelf-title__shelf-dropdown").style.height =
          "0px";
      }
    },
    activeShelf(newValue) {
      if (newValue && this.libraryShelfSelectOpen) {
        this.toggleShelfSelect();
      }
    },
    createShelfFormOpen(newValue) {
      const outerDropdown = document.querySelector(
        ".shelf-title__shelf-dropdown"
      );
      if (newValue) {
        outerDropdown.style.height = outerDropdown.scrollHeight + 132 + "px";
      } else {
        outerDropdown.style.height = outerDropdown.scrollHeight - 132 + "px";
      }
    },
  },
  methods: {
    ...mapMutations([
      "toggleModal",
      "toggleLibraryShelfSelectOpen",
      "setActiveShelf",
    ]),
    ...mapActions(["addShelf"]),
    toggleShelfSelect() {
      this.toggleModal();
      this.toggleLibraryShelfSelectOpen();
      if (this.createShelfFormOpen) {
        this.createShelfFormOpen = false;
      }
    },
    toggleCreateShelfForm() {
      this.createShelfFormOpen = !this.createShelfFormOpen;
    },
    async createShelf() {
      const newShelf = await this.addShelf(this.newShelfName);
      this.setActiveShelf(newShelf);
      this.newShelfName = "";
    },
  },
};
</script>

<style>
.shelf-title {
  position: relative;
}
.shelf-title__select-wrapper {
  width: fit-content;
  cursor: pointer;
}
.shelf-title__select-icon .up,
.shelf-title__select-icon .down {
  width: var(--spacing-size-1);
  height: var(--spacing-size-1);
}
.shelf-title__select-icon .up {
  transform: rotate(180deg);
}
.shelf-title__shelf-dropdown {
  left: var(--spacing-size-1);
  top: 40px;
  width: calc(240px + (var(--spacing-size-1) * 2));
}
.shelf-title__dropdown-list {
  max-height: 450px;
  overflow-y: auto;
}
.create-shelf {
  height: 0;
  visibility: hidden;
  overflow: hidden;
  transition: all 0.25s ease-in-out;
}
.create-shelf.open {
  height: 132px;
  visibility: visible;
}
</style>
