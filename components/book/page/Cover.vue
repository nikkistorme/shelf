<template>
  <div class="book-page__cover d-flex jc-center">
    <nuxt-img
      v-if="coverImage"
      :src="coverImage"
      :alt="coverAltText"
      format="webp"
    />
    <div
      v-else
      class="book-page__cover-placeholder d-flex flex-column jc-between ai-center p-1"
    >
      <h5>{{ userBook.title }}</h5>
      <p>{{ userBook.author }}</p>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";

export default {
  setup() {
    const bookStore = useBookStore();
    const { book, userBook } = storeToRefs(bookStore);

    const coverImage = computed(() => {
      if (userBook?.value?.cover) return userBook.value.cover;
      if (book?.value?.cover) return book.value.cover;
      return null;
    });

    const coverAltText = computed(() => {
      if (userBook?.value?.title) return userBook.value.title;
      if (book?.value?.title) return book.value.title;
      return "";
    });

    const userAuth = useSupabaseUser();

    return {
      coverImage,
      coverAltText,
      userBook,
      userAuth,
    };
  },
};
</script>

<style scoped>
.book-page__cover {
  height: 350px;
  max-width: 100%;
}
.book-page__cover img {
  height: 100%;
  border-radius: 5px;
  object-fit: contain;
  object-position: bottom;
  box-shadow: var(--box-shadow-2);
}
.book-page__cover-placeholder {
  height: 250px;
  width: 175px;
  border-radius: 5px;
  background-color: var(--color-grey);
  text-align: center;
}
</style>
