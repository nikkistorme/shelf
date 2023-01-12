<template>
  <div
    class="book-page__update-info generic-modal d-flex flex-column gap-2"
    :class="{ open: props.open }"
  >
    <div class="d-flex flex-column gap-1">
      <h4 class="book-page__update-info-heading">Cover</h4>
      <BookPageCoverUpload />
    </div>
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

<script>
import { storeToRefs } from "pinia";
import { newChange, sortChanges } from "~~/services/changeService";
import { useBookStore } from "~~/store/BookStore";
import { useModalStore } from "~~/store/ModalStore";

export default {
  props: {
    open: Boolean,
  },
  setup(props) {
    const bookStore = useBookStore();
    const { userBook } = storeToRefs(bookStore);
    const newTotalPages = ref(userBook.value.total_pages);

    const modalStore = useModalStore();
    async function updateTotalPages() {
      const change = newChange("updateTotalPages", userBook.value, {
        total_pages: newTotalPages.value,
      });
      let newChanges = [...userBook.value.changes, change];
      newChanges = sortChanges(newChanges);
      const bookUpdates = {
        changes: newChanges,
        total_pages: newTotalPages.value,
      };
      await bookStore.updateUserBook(userBook.value.id, bookUpdates);
      // modalStore.closeModal();
    }

    const userAuth = useSupabaseUser();

    const removeBookFromLibrary = async () => {
      await bookStore.removeBookFromLibrary();
    };

    return {
      props,
      newTotalPages,
      updateTotalPages,
      userAuth,
      userBook,
      removeBookFromLibrary,
    };
  },
};
</script>

<style>
.book-page__update-info.open {
  visibility: visible;
  height: auto;
  min-width: 350px;
  width: auto;
  max-width: 450px;
}
.book-page__update-info-heading {
  margin: 0;
}
</style>
