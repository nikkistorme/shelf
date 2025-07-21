<template>
  <div class="book-page__update-info d-flex flex-column gap-2">
    <!-- <div class="d-flex flex-column gap-1">
      <h4 class="book-page__update-info-heading">Cover</h4>
      <BookPageCoverUpload />
    </div> -->
    <form class="d-flex flex-column gap-1" @submit.prevent="updateTotalPages">
      <h4 class="book-page__update-info-heading">Total pages</h4>
      <div class="d-flex ai-center gap-1">
        <InputNumber id="update-book-total-pages" v-model="newTotalPages" />
        <ButtonDefault type="submit">Update total pages</ButtonDefault>
      </div>
    </form>
    <ButtonInline
      v-if="userAuth && userBook?.id"
      text="Remove from library"
      color="red"
      underline
      @click="removeBookFromLibrary"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { newChange, sortChanges } from "~~/services/changeService";
import { useBookStore } from "~~/store/BookStore";
import { useModalStore } from "~~/store/ModalStore";

const bookStore = useBookStore();
const { userBook } = storeToRefs(bookStore);
const newTotalPages = ref(userBook?.value?.total_pages || 0);

const modalStore = useModalStore();
async function updateTotalPages() {
  if (!userBook.value) return;
  const change: Change = newChange(
    "updateTotalPages",
    userBook.value as UserBook,
    {
      total_pages: newTotalPages.value,
    } as MiscUpdateParam
  );
  let newChanges: Change[] = [...userBook.value.changes, change];
  newChanges = sortChanges(newChanges);
  const bookUpdates = {
    changes: newChanges,
    total_pages: newTotalPages.value,
  };
  await bookStore.updateUserBook(userBook.value.id, bookUpdates);
}

const userAuth = useSupabaseUser();

const removeBookFromLibrary = async () => {
  if (!userBook.value) return;
  await bookStore.removeBookFromLibrary(userBook.value.id);
  modalStore.closeModal();
};
</script>

<style>
.book-page__update-info {
  min-width: 290px;
}
.book-page__update-info-heading {
  margin: 0;
}
</style>
