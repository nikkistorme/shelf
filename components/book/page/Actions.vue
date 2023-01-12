<template>
  <div class="bp-actions d-flex jc-center">
    <ButtonDefault v-if="userAuth && !userBook?.id" @click="addBookToLibrary">
      Add to library
    </ButtonDefault>
    <BookPageEditInfo
      v-if="userAuth && userBook?.id"
      class="book-page__edit-icon"
    />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";

export default {
  setup() {
    const userAuth = useSupabaseUser();

    const bookStore = useBookStore();
    const { userBook } = storeToRefs(bookStore);

    const addBookToLibrary = async () => {
      await bookStore.addBookToLibrary();
    };

    return {
      userAuth,
      userBook,
      addBookToLibrary,
    };
  },
};
</script>
