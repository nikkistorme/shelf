<template>
  <div class="modal-shelf-change generic-modal flex-column">
    <div class="modal-shelf-change__wrapper d-flex flex-column ai-end">
      <ul class="modal-shelf-change__list w-100">
        <li
          v-for="(shelf, i) in getSortedShelves"
          :key="i"
          class="modal-shelf-change__shelf d-flex jc-between ai-center"
          :class="{ 'mb-1': i !== shelves.length - 1 }"
        >
          <div class="d-flex">
            <p
              v-if="shelf.id === activeShelf.id"
              class="modal-shelf-change__active-shelf-name"
            >
              {{ shelf.name }}
            </p>
            <NuxtLink
              v-else
              :to="`/shelves/${shelf.id}`"
              @click="changeShelves"
            >
              {{ shelf.name }}
            </NuxtLink>
            <div>
              <p>&nbsp;({{ shelf.book_count }})</p>
            </div>
          </div>
          <IconClose
            v-if="canDeleteShelf(shelf)"
            class="shelves-list__delete cursor-pointer"
            color="red"
            @click="deleteShelf(shelf.id)"
          />
        </li>
      </ul>
      <hr class="my-2" />
      <ButtonDefault
        :color="creatingNewShelf ? 'red' : 'blue'"
        @click="toggleCreateShelfForm"
      >
        {{ creatingNewShelf ? "Cancel" : "New shelf" }}
      </ButtonDefault>
      <form
        class="create-shelf d-flex flex-column ai-end w-100"
        :class="{ open: creatingNewShelf }"
        @submit.prevent="createNewShelf"
      >
        <InputDefault
          id="create-shelf-name"
          v-model="newShelfName"
          label="Name"
          class="create-shelf__name w-100 mb-1"
        />
        <ButtonDefault type="submit" flavor="tiny" color="blue">
          Create
        </ButtonDefault>
      </form>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useShelfStore } from "~/store/ShelfStore";
import { useModalStore } from "~/store/ModalStore";

export default {
  setup() {
    const shelfStore = useShelfStore();
    const { activeShelf, shelves, getSortedShelves } = storeToRefs(shelfStore);

    const modalStore = useModalStore();
    const changeShelves = () => {
      modalStore.closeModal();
    };

    const creatingNewShelf = ref(false);
    const newShelfName = ref("");
    const toggleCreateShelfForm = () => {
      newShelfName.value = "";
      creatingNewShelf.value = !creatingNewShelf.value;
    };

    const createNewShelf = async () => {
      await shelfStore.createNewShelf(newShelfName.value);
      toggleCreateShelfForm();
    };

    const canDeleteShelf = (shelf) => {
      return (
        !shelf.all_books_shelf &&
        !shelf.finished_shelf &&
        !shelf.in_progress_shelf &&
        !shelf.unread_shelf
      );
    };

    async function deleteShelf(shelf_id) {
      await shelfStore.deleteShelf(shelf_id);
    }

    return {
      shelves,
      getSortedShelves,
      activeShelf,
      changeShelves,
      creatingNewShelf,
      newShelfName,
      toggleCreateShelfForm,
      createNewShelf,
      canDeleteShelf,
      deleteShelf,
    };
  },
};
</script>

<style>
.modal-shelf-change {
  height: auto;
  width: auto;
  visibility: visible;
}
.modal-shelf-change__active-shelf-name {
  font-weight: bold;
  text-decoration: underline;
}
.modal-shelf-change__delete {
  height: 16px;
  width: 16px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
.modal-shelf-change__shelf .modal-shelf-change__delete {
  pointer-events: all;
  cursor: pointer;
  opacity: 1;
}
</style>
