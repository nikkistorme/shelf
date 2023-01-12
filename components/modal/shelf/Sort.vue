<template>
  <div class="modal-shelf-sort generic-modal d-flex flex-column gap-1">
    <h2>Sort by</h2>
    <ul class="d-flex flex-column gap-half">
      <li v-for="(option, i) in sortOptions" :key="i">
        <ButtonInline
          v-if="sortMethod !== option.value"
          class="shelf-sort__button"
          color="blue"
          :text="option.label"
          @click="sortMethod = option.value"
        />
        <span v-else class="shelf-sort__selected">
          {{ option.label }}
        </span>
      </li>
    </ul>
    <h2>Direction</h2>
    <div class="d-flex flex-column gap-half">
      <ButtonInline
        v-if="sortDescending"
        text="Ascending"
        color="blue"
        @click="sortDescending = !sortDescending"
      />
      <span v-else class="shelf-sort__selected">Ascending</span>
      <ButtonInline
        v-if="!sortDescending"
        text="Descending"
        color="blue"
        @click="sortDescending = !sortDescending"
      />
      <span v-else class="shelf-sort__selected">Descending</span>
    </div>
    <hr />
    <div class="d-flex jc-between">
      <ButtonDefault color="red" @click="closeModal">Cancel</ButtonDefault>
      <ButtonDefault @click="updateShelfSort">Confirm</ButtonDefault>
    </div>
  </div>
</template>

<script>
import { useShelfStore } from "~~/store/ShelfStore";
import { useModalStore } from "~~/store/ModalStore";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const shelfStore = useShelfStore();
    const { activeShelf } = storeToRefs(shelfStore);

    const sortOptions = ref([
      {
        value: "date_added_to_library",
        label: "Date added to library",
      },
      {
        value: "title",
        label: "Title",
      },
    ]);
    if (activeShelf.value.in_progress_shelf) {
      sortOptions.concat([
        {
          value: "percent_complete",
          label: "Progress",
        },
        {
          value: "last_updated_progress",
          label: "Last updated progress",
        },
        {
          value: "date_added_to_shelf",
          label: "Date started",
        },
      ]);
    }

    const sortMethod = ref(activeShelf.value.sort.method);
    const sortDescending = ref(activeShelf.value.sort.descending);

    const modalStore = useModalStore();
    const { closeModal } = modalStore;
    async function updateShelfSort() {
      activeShelf.value.sort.method = sortMethod;
      activeShelf.value.sort.descending = sortDescending;
      await shelfStore.updateShelfSort(activeShelf.value);
      modalStore.closeModal();
    }

    return {
      sortMethod,
      sortDescending,
      sortOptions,
      updateShelfSort,
      closeModal,
    };
  },
};
</script>

<style>
.modal-shelf-sort {
  height: auto;
  width: max-content;
  visibility: visible;
}
.shelf-sort__selected {
  text-decoration: underline;
  font-weight: 700;
  line-height: var(--line-height-1);
}
</style>
