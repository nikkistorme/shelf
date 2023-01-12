<template>
  <div class="home-shelf d-flex flex-column jc-end">
    <div
      class="home-shelf__books d-flex jc-start gap-1"
      :style="{ 'max-width': shelfMaxWidth }"
    >
      <BookShelved
        v-for="(book, i) in booksOnThisShelf"
        :key="i"
        :book="book"
        class="home-shelf__book"
        location="home"
      />
    </div>
  </div>
</template>

<script>
import { useShelfStore } from "~~/store/ShelfStore";
import { useBookStore } from "~~/store/BookStore";

export default {
  setup() {
    const shelfStore = useShelfStore();
    const bookStore = useBookStore();

    const booksOnThisShelf = computed(() => {
      return bookStore.inProgressBooks;
    });

    const sortOptions = ref([
      {
        value: "date_added_to_library",
        label: "Date added",
      },
      {
        value: "percent_complete",
        label: "Progress",
      },
      {
        value: "last_updated_progress",
        label: "Last updated progress",
      },
      {
        value: "date_added_to_shelf",
        label: "Date started",
      },
    ]);

    const shelfMaxWidth = computed(() => {
      const bookCount = booksOnThisShelf.value.length;
      const columnCount = Math.ceil(bookCount / 2);
      // console.log("🚀 ~ columnCount", columnCount);
      const bookWidth = 125;
      const gapWidth = 16;
      const totalWidth = columnCount * bookWidth + (bookCount - 1) * gapWidth;
      return `${totalWidth}px`;
    });

    const shelf = ref({ ...shelfStore.inProgressShelf });

    function changeSortDirection() {
      shelf.value.sort.descending = !shelf.value.sort.descending;
    }

    watch(
      shelf,
      (newValue) => {
        shelfStore.updateShelfSort(newValue);
      },
      { deep: true }
    );

    return {
      shelfStore,
      booksOnThisShelf,
      sortOptions,
      shelfMaxWidth,
      shelf,
      changeSortDirection,
    };
  },
};
</script>

<style scoped>
.home-shelf {
  width: 100%;
  padding: var(--spacing-size-1);
  border-radius: var(--border-radius-1);
  background: var(--color-gray);
}
.home-shelf__books {
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 425px;
  overflow-x: auto;
  overflow-y: hidden;
}
.home-shelf__floor {
  position: relative;
  padding: calc(var(--spacing-size-1) / 4) var(--spacing-size-1);
  border: 2px solid var(--color-gray);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.home-shelf__sort-method {
  margin-right: 20px;
  border: none;
  background: none;
  text-align: right;
}
.home-shelf__sort-direction {
  position: absolute;
  right: 0;
  height: 100%;
  width: 40px;
  cursor: pointer;
}
.home-shelf__sort-direction svg {
  height: 10px;
  width: 10px;
}
.home-shelf__sort-direction.ascending svg {
  transform: rotate(180deg);
}
</style>
