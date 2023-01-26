<template>
  <div class="modal-shelf-sort generic-modal d-flex flex-column gap-1">
    <div class="d-flex gap-1">
      <h2>Sort Books</h2>
      <button
        v-show="!sortDescending"
        @click="sortDescending = !sortDescending"
        class="shelf-sort__order descend button-style-reset cursor-pointer"
      >
        Sort by descending
        <IconArrowDown />
      </button>
      <button
        v-show="sortDescending"
        @click="sortDescending = !sortDescending"
        class="shelf-sort__order ascend button-style-reset cursor-pointer"
      >
        Sort by ascending
        <IconArrowDown />
      </button>
    </div>
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
      {
        value: "author",
        label: "Author",
      },
      {
        value: "page_count",
        label: "Page count",
      },
    ]);
    if (activeShelf.value.locked_type === "in_progress") {
      sortOptions.value = sortOptions.value.concat([
        {
          value: "percent_complete",
          label: "Progress",
        },
        {
          value: "last_updated_progress",
          label: "Last updated progress",
        },
      ]);
    }
    if (activeShelf.value.locked_type !== "unread")
      sortOptions.value.push({
        value: "date_finished",
        label: "Date finished",
      });

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
.shelf-sort__order {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-gray);
  font-size: 0;
}
.shelf-sort__order.descend {
  transform: rotate(180deg);
}
.shelf-sort__order svg {
  width: 15px;
  height: 15px;
}
</style>
