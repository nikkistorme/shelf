<template>
  <div class="shelved-book" :class="location">
    <NuxtLink
      :to="`/books/${props.book.base}`"
      class="shelved-book__cover"
      :class="location"
    >
      <nuxt-img
        v-if="props?.book?.cover"
        :src="props.book.cover"
        :alt="props.book.title"
        format="webp"
        sizes="sm:125px md:175px lg:250px"
      />
      <div
        v-else
        class="shelved-book__cover-placeholder d-flex flex-column jc-between ai-center p-1"
      >
        <h5>{{ props.book.title }}</h5>
        <p>{{ props.book.author }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    book: Object,
    location: String,
  },
  setup(props) {
    const router = useRouter();

    async function viewBookDetails() {
      await router.push(`/books/${props.book.base}`);
    }
    return {
      router,
      props,
      viewBookDetails,
    };
  },
};
</script>

<style>
.shelved-book.home {
  width: fit-content;
}
.shelved-book__cover img {
  border-radius: 5px;
  object-fit: contain;
  object-position: bottom;
  box-shadow: var(--box-shadow-2);
}
.home.shelved-book__cover {
  display: flex;
  align-items: flex-end;
  width: 125px;
  height: min-content;
}
.home.shelved-book__cover img {
  height: auto;
  width: 100%;
  object-fit: contain;
  object-position: bottom;
}
.library.shelved-book__cover {
  display: flex;
  align-items: flex-end;
  height: 100%;
}
.library.shelved-book__cover img {
  width: 100%;
}
.shelved-book__cover-placeholder {
  height: 100%;
  border-radius: 5px;
  background-color: var(--color-grey);
  text-align: center;
}
.home .shelved-book__cover-placeholder {
  height: 250px;
  width: 175px;
}
</style>
