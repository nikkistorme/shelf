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

<script setup lang="ts">
const updatingInfo = ref(false);
</script>
