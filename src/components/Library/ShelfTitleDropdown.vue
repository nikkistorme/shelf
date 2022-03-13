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
    <div
      class="shelf-title__shelf-dropdown flex-column"
      :class="{ open: libraryShelfSelectOpen }"
    >
      <div
        class="shelf-title__shelf-dropdown-wrapper d-flex flex-column ai-end p-1 pt-2"
      >
        <ul class="shelf-title__dropdown-list w-100 px-1">
          <li
            v-for="(shelf, i) in sortedShelves"
            :key="i"
            class="d-flex jc-space-between"
            :class="{ 'mb-1': i !== sortedShelves.length - 1 }"
          >
            <p
              v-if="shelf.id === activeShelf.id"
              class="shelf-title__active-shelf-name"
            >
              {{ shelf.name }}
            </p>
            <InlineButton
              v-else
              :text="shelf.name"
              color="blue"
              @click="changeActiveShelf(shelf)"
            />
            <div>
              <p>({{ getBooksOnShelf(shelf).length }})</p>
            </div>
          </li>
        </ul>
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
import InlineButton from "../buttons/InlineButton.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import DefaultInput from "../forms/DefaultInput.vue";

// const addHeightForNewShelf = () => {
//   const outerDropdown = document.querySelector(".shelf-title__shelf-dropdown");
//   const shelfList = document.querySelector(".shelf-title__dropdown-list");
//   console.log("🚀 ~ shelfList", shelfList);
//   if (shelfList.clientHeight < 450) {
//     outerDropdown.style.height = outerDropdown.clientHeight + 41.88 + "px";
//   }
// };

export default {
  components: { ArrowDown, InlineButton, DefaultButton, DefaultInput },
  data() {
    return {
      createShelfFormOpen: false,
      newShelfName: "",
    };
  },
  computed: {
    ...mapGetters([
      "books",
      "shelves",
      "libraryShelfSelectOpen",
      "activeShelf",
      "getBooksOnShelf",
    ]),
    sortedShelves() {
      const allBooksShelf = this.shelves.find((shelf) => shelf.allBooksShelf);
      const finishedShelf = this.shelves.find((shelf) => shelf.finishedShelf);
      const inProgressShelf = this.shelves.find(
        (shelf) => shelf.inProgressShelf
      );
      const shelves = this.shelves.filter(
        (shelf) =>
          !shelf.allBooksShelf && !shelf.finishedShelf && !shelf.inProgressShelf
      );
      shelves.sort((a, b) => (a.name > b.name ? 1 : -1));
      if (inProgressShelf) shelves.unshift(inProgressShelf);
      if (finishedShelf) shelves.unshift(finishedShelf);
      if (allBooksShelf) shelves.unshift(allBooksShelf);
      return shelves;
    },
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
    // sortedShelves() {
    //   addHeightForNewShelf();
    // },
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
    changeActiveShelf(shelf) {
      this.setActiveShelf(shelf);
      this.toggleShelfSelect();
    },
    toggleCreateShelfForm() {
      this.createShelfFormOpen = !this.createShelfFormOpen;
    },
    async createShelf() {
      const newShelf = await this.addShelf(this.newShelfName);
      this.changeActiveShelf(newShelf);
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
  margin-bottom: var(--spacing-size-2);
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
  position: absolute;
  left: var(--spacing-size-1);
  top: 40px;
  display: flex;
  width: calc(240px + (var(--spacing-size-1) * 2));
  border-radius: var(--border-radius-2);
  background-color: white;
  box-shadow: var(--box-shadow-1);
  visibility: hidden;
  overflow: hidden;
  transition: all 0.25s ease-in-out;
  z-index: 2;
}
.shelf-title__shelf-dropdown:not(.open) {
  height: 0px !important;
}
.shelf-title__shelf-dropdown.open {
  display: flex;
  visibility: visible;
}
.shelf-title__dropdown-list {
  max-height: 450px;
  overflow-y: auto;
}
.shelf-title__active-shelf-name {
  font-weight: bold;
  text-decoration: underline;
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
