<template>
  <ul class="shelves-list w-100 px-1">
    <li
      v-for="(shelf, i) in sortedShelves"
      :key="i"
      class="shelves-list__shelf d-flex jc-space-between ai-center"
      :class="{ 'mb-1': i !== sortedShelves.length - 1 }"
    >
      <div class="d-flex">
        <p
          v-if="shelf.id === activeShelf.id"
          class="shelves-list__active-shelf-name"
        >
          {{ shelf.name }}
        </p>
        <InlineButton
          v-else
          :text="shelf.name"
          color="blue"
          @click="setActiveShelf(shelf)"
        />
        <div>
          <p>&nbsp;({{ getBooksOnShelf(shelf).length }})</p>
        </div>
      </div>
      <CloseIcon
        v-if="canDeleteShelf(shelf)"
        class="shelves-list__delete"
        color="red"
        @click="removeShelf(shelf)"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import InlineButton from "../buttons/InlineButton.vue";
import CloseIcon from "../icons/CloseIcon.vue";

export default {
  components: { InlineButton, CloseIcon },
  computed: {
    ...mapGetters(["shelves", "activeShelf", "getBooksOnShelf"]),
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
  methods: {
    ...mapMutations(["setActiveShelf", "setConfirmAction"]),
    ...mapActions(["deleteShelf"]),
    canDeleteShelf(shelf) {
      return (
        !shelf.allBooksShelf && !shelf.finishedShelf && !shelf.inProgressShelf
      );
    },
    removeShelf(shelf) {
      console.log("🚀 ~ delete shelf", shelf);
      this.setConfirmAction({
        message: `Are you sure you want to delete the shelf "${shelf.name}"? This cannot be undone.`,
        confirmMethod: () => this.deleteShelf(shelf),
        confirmMessage: "Do it now!",
        cancelMessage: "Oh, no thanks",
      });
    },
  },
};
</script>

<style>
.shelves-list__active-shelf-name {
  font-weight: bold;
  text-decoration: underline;
}
.shelves-list__delete {
  height: 16px;
  width: 16px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
.shelves-list__shelf:hover .shelves-list__delete {
  pointer-events: all;
  cursor: pointer;
  opacity: 1;
}
</style>
