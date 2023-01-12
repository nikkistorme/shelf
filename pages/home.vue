<template>
  <div
    v-if="profile?.id && getSortedShelves && inProgressShelf"
    class="home-page d-grid"
  >
    <Head>
      <Link
        v-for="(image, i) in inProgressBookImages"
        :key="i"
        rel="preload"
        fetchpriority="high"
        as="image"
        :href="image"
      />
    </Head>
    <div class="home-page__continue-reading d-flex flex-column gap-1">
      <h2>Continue reading</h2>
      <HomeShelf v-if="inProgressShelf.book_count > 0" />
      <div class="" v-else>
        <p>
          You don't have any books in progress. <br />
          Check out your
          <NuxtLink :to="`/shelves/${unreadShelf.id}`">
            {{ unreadShelf.name }}
          </NuxtLink>
          shelf to find something to read.
        </p>
      </div>
    </div>
    <div class="home-page__progress">
      <HomeProgress />
    </div>
    <div class="home-page__shelves d-flex flex-column gap-1">
      <h2>Jump to a shelf</h2>
      <div class="d-flex flex-wrap gap-half">
        <div
          v-for="(shelf, i) in getSortedShelves"
          :key="i"
          class="d-flex gap-half"
        >
          <span v-if="i > 0">|</span>
          <NuxtLink :to="`shelves/${shelf.id}`">
            {{ `${shelf.name} (${shelf.book_count})` }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBookStore } from "~/store/BookStore";
import { useShelfStore } from "~/store/ShelfStore";
import { useUserStore } from "~/store/UserStore";
import { storeToRefs } from "pinia";

export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth", "home"],
    });

    const userStore = useUserStore();
    const { profile } = storeToRefs(userStore);

    const shelfStore = useShelfStore();
    const { inProgressShelf, unreadShelf, getSortedShelves } =
      storeToRefs(shelfStore);

    const bookStore = useBookStore();
    const inProgressBookImages = computed(() => {
      return bookStore.inProgressBooks.map((book) => book.cover);
    });

    onMounted(() => {
      if (!inProgressShelf.value) shelfStore.fetchShelves();
    });

    return {
      profile,
      inProgressShelf,
      unreadShelf,
      inProgressBookImages,
      getSortedShelves,
    };
  },
};
</script>

<style>
.home-page {
  grid-gap: var(--spacing-size-3);
}
.home-page__list-item {
  position: relative;
}
@media (min-width: 768px) {
  .home-page {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
  .home-page__continue-reading {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }
  .home-page__progress {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    margin-top: var(--spacing-size-3);
  }
  .home-page__shelves {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
}
</style>
