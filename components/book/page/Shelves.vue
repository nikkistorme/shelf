<template>
  <div class="bp-shelves d-flex gap-half">
    <ul
      v-if="selectedShelves?.length"
      class="selected-shelves d-flex flex-wrap gap-half"
    >
      <li v-for="(s, i) in selectedShelves" :key="i" class="selected-shelf">
        <NuxtLink :to="`/shelves/${s.id}`">{{ s.name }}</NuxtLink>
      </li>
    </ul>

    <div class="w-fit-content" @click="beginShelvesEdit">
      <ButtonInline
        v-if="!selectedShelves?.length"
        color="primary"
        class="add-to-shelf-btn"
      >
        Add to shelves
      </ButtonInline>

      <IconEditPencil v-else class="cursor-pointer" />
    </div>

    <ModalGeneral
      :show="editingShelves"
      :close="() => (editingShelves = false)"
      class="edit-shelf-modal"
    >
      <template #content>
        <InputMultiSelect
          legend="Shelves"
          v-model:value="selectedShelvesIds"
          :options="options"
          class="mb-1"
        />
      </template>
      <template #actions>
        <ButtonDefault @click="cancelShelfEdit" color="red">
          Cancel
        </ButtonDefault>
        <ButtonDefault @click="saveBookShelves">Apply</ButtonDefault>
      </template>
    </ModalGeneral>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";
import { useShelfStore } from "~/store/ShelfStore";
import { useModalStore } from "~/store/ModalStore";

const bookStore = useBookStore();
const shelfStore = useShelfStore();
const modalStore = useModalStore();

const { userBook } = storeToRefs(bookStore);
const { shelves } = storeToRefs(shelfStore);

if (!shelves?.value?.length) await shelfStore.fetchShelves();

const selectedShelves = computed(() => {
  return shelves.value
    .filter((s) =>
      userBook?.value?.shelves.find(
        (s_id) => s.id.toString() === s_id.toString()
      )
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

const selectedShelvesIds = ref(
  userBook?.value?.shelves ? [...userBook.value.shelves] : []
);

const options = computed(() => {
  return shelves.value
    .filter((s) => !s.locked_type)
    .map((shelf) => {
      return {
        value: shelf.id.toString(),
        id: `shelf-${shelf.id}`,
        label: shelf.name,
      };
    });
});

const editingShelves = ref(false);
const beginShelvesEdit = (): void => {
  editingShelves.value = true;
  modalStore.openModal();
};

const cancelShelfEdit = (): void => {
  editingShelves.value = false;
  modalStore.closeModal();
};

const saveBookShelves = async (): Promise<void> => {
  if (!userBook?.value?.shelves) return;

  const newShelves = selectedShelvesIds.value;
  const oldShelves = userBook.value.shelves;

  let removedShelves = oldShelves.filter((x) => !newShelves.includes(x));
  let addedShelves = newShelves.filter((x) => !oldShelves.includes(x));

  userBook.value.shelves = selectedShelvesIds.value;
  await bookStore.updateUserBook(userBook.value.id, {
    shelves: userBook.value.shelves,
  });

  for (const shelfId of removedShelves) {
    await shelfStore.incrementShelfCount(shelfId, -1);
  }
  for (const shelfId of addedShelves) {
    await shelfStore.incrementShelfCount(shelfId, 1);
  }

  editingShelves.value = false;
  modalStore.closeModal();
};

const { modal } = storeToRefs(modalStore);
watch(modal, (newValue) => {
  if (!newValue) {
    editingShelves.value = false;
  }
});
</script>

<style scoped>
.selected-shelf,
.add-to-shelf-btn {
  padding: 0 var(--spacing-size-half);
  border-radius: var(--border-radius-2);
  background-color: var(--color-gray);
}
</style>
