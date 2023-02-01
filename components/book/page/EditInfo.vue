<template>
  <div>
    <IconEditPencil class="cursor-pointer" @click="updatingInfo = true" />
    <ModalGeneral :show="updatingInfo" :close="() => (updatingInfo = false)">
      <template #content>
        <BookPageInfo />
      </template>
    </ModalGeneral>
  </div>
</template>

<script>
export default {
  setup() {
    const updatingInfo = ref(false);

    return {
      updatingInfo,
    };
  },
};
</script>

<style scoped>
/* .book-page__edit-icon {
  position: absolute;
  top: var(--spacing-size-1);
  right: var(--spacing-size-1);
} */
</style>
