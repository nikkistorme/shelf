<template>
  <div class="bp-actions d-flex jc-evenly">
    <ButtonDefault v-if="userAuth && !userBook?.id" @click="addBookToLibrary">
      Add to library
    </ButtonDefault>
    <BookPageEditInfo
      v-if="userAuth && userBook?.id"
      class="book-page__edit-icon"
    />
    <div class="tooltip-wrapper">
      <IconShare @click="copyBookLink" class="cursor-pointer" />
      <Tooltip>{{ shareTip }}</Tooltip>
    </div>
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

    const shareTip = ref("Copy book URL");
    const copyBookLink = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      shareTip.value = "Copied!";
      setTimeout(() => {
        shareTip.value = "Copy book URL";
      }, 2000);
    };

    return {
      userAuth,
      userBook,
      addBookToLibrary,
      shareTip,
      copyBookLink,
    };
  },
};
</script>
