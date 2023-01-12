<template>
  <div class="book-page d-flex jc-center">
    <Title v-if="book?.title">{{ book.title }}</Title>

    <div :class="`book-page__content w-100 ${userAuth ? 'signed-in' : ''}`">
      <div class="book-page__cover-area d-flex flex-column gap-half">
        <BookPageCover />
        <BookPageActions />
      </div>

      <div class="book-page__base-area d-flex flex-column gap-half w-100">
        <BookPageTitle v-if="book?.title" />
        <BookPageAuthor v-if="book?.author" :book="book" />
        <div class="book-page__base-extra d-flex ai-baseline gap-half">
          <BookPageTotalPages v-if="book?.total_pages" />
          <BookPagePublishing v-if="book?.publisher" :book="book" />
        </div>
      </div>

      <div class="book-page__user-area gap-1" v-if="userAuth">
        <BookPageStatus v-if="userBook?.id" />
        <BookPageShelves v-if="userBook && shelves?.length" />
        <div
          class="book-page__in-progress-info d-flex flex-wrap"
          v-if="userBook?.status === 'in_progress'"
        >
          <BookPageProgress :book="userBook" />
          <BookPageGoal :book="userBook" class="py-1" />
        </div>
        <!-- TODO: Show book insights -->
        <!-- TODO: Show book history -->
      </div>

      <div class="book-page__additional-area">
        <BookPageDescription v-if="book?.description" :book="book" />
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";
import { useShelfStore } from "~/store/ShelfStore";

export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth", "book"],
    });
    const userAuth = useSupabaseUser();

    const bookStore = useBookStore();
    const { book, userBook } = storeToRefs(bookStore);

    const shelfStore = useShelfStore();
    const { shelves } = storeToRefs(shelfStore);

    return {
      userAuth,
      book,
      userBook,
      shelves,
    };
  },
};
</script>

<style>
.book-page__content {
  position: relative;
  display: grid;
  gap: var(--spacing-size-1);
  height: min-content;
  background: var(--color-white);
}
.book-page__base-area {
  justify-self: start;
  /* width: fit-content; */
}
.book-page__base-extra {
  justify-content: center;
}
.book-page__user-area {
  display: grid;
  grid-auto-rows: min-content;
  padding: var(--spacing-size-1);
  border: var(--border-1);
  border-radius: var(--border-radius-1);
  box-shadow: var(--box-shadow-1);
}
.book-page__in-progress-info {
  column-gap: var(--spacing-size-3);
}
@media (min-width: 768px) {
  .book-page__content {
    grid-gap: var(--spacing-size-3);
  }
  .book-page__content:not(.signed-in) {
    grid-template-areas:
      "cover base"
      "cover additional";
  }
  .book-page__content.signed-in {
    grid-template-areas:
      "cover base"
      "cover user"
      "cover additional";
  }
  .book-page__cover-area {
    grid-area: cover;
  }
  .book-page__base-area {
    grid-area: base;
  }
  .book-page__user-area {
    grid-area: user;
  }
  .book-page__additional-area {
    grid-area: additional;
  }
  .book-page__base-extra {
    justify-content: start;
  }
}
</style>
