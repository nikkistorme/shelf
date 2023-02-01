<template>
  <div class="bp-details">
    <div class="tooltip-wrapper">
      <IconDetails
        class="bp-details__icon cursor-pointer"
        @click="viewingDetails = true"
      />
      <Tooltip>Your book details</Tooltip>
    </div>
    <ModalGeneral
      :show="viewingDetails"
      :close="() => (viewingDetails = false)"
      class="bp-details__modal"
    >
      <template #content>
        <div>
          <BookPageReadthroughs />
        </div>
      </template>
    </ModalGeneral>
  </div>
</template>

<script>
export default {
  setup() {
    const viewingDetails = ref(false);
    return { viewingDetails };
  },
};
</script>

<style scoped>
.bp-details {
  position: absolute;
  top: var(--spacing-size-1);
  right: var(--spacing-size-1);
}
.bp-details__icon {
  width: var(--spacing-size-2);
  height: var(--spacing-size-2);
}
.bp-details .tooltip {
  left: -100%;
}
.bp-details__modal {
  width: 100%;
  max-width: 400px;
}
</style>
