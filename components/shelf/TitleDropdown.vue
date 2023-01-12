<template>
  <div class="shelf-title">
    <div
      v-show="!editName"
      class="shelf-title__select-wrapper d-flex ai-center"
      @click="openShelfSelectModal"
    >
      <div
        class="shelf-title__select-icon d-flex flex-column jc-space-around mr-1"
      >
        <IconArrowDown class="up" />
        <IconArrowDown class="down" />
      </div>
      <h2 v-if="activeShelf?.name" class="shelf-title__name">
        {{ activeShelf.name }}
      </h2>
    </div>
    <IconEditPencil
      v-show="!editName"
      class="cursor-pointer"
      @click="toggleEditName"
    />
    <form
      v-show="editName"
      class="d-flex ai-center gap-1"
      @submit.prevent="updateShelfName"
    >
      <InputDefault v-model="newShelfName" placeholder="New shelf name" />
      <IconClose color="red" class="cursor-pointer" @click="toggleEditName" />
      <IconCheckmark
        class="book-details__pages-edit-confirm cursor-pointer"
        @click="updateShelfName"
      />
    </form>
    <ModalShelfChange v-if="selectingShelf" />
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

    const selectingShelf = ref(false);
    const modalStore = useModalStore();
    function openShelfSelectModal() {
      selectingShelf.value = true;
      modalStore.openModal();
    }

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        selectingShelf.value = false;
      }
    });

    const editName = ref(false);
    const newShelfName = ref("");

    async function updateShelfName() {
      await shelfStore.updateShelfName(
        activeShelf.value.id,
        newShelfName.value
      );
      newShelfName.value = activeShelf.value.name;
      editName.value = false;
    }

    function toggleEditName() {
      editName.value = !editName.value;
      newShelfName.value = activeShelf.value.name;
    }

    return {
      activeShelf,
      selectingShelf,
      openShelfSelectModal,
      newShelfName,
      updateShelfName,
      editName,
      toggleEditName,
    };
  },
};
</script>

<style>
.shelf-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-size-1);
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
