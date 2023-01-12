<template>
  <div class="general generic-modal">
    <slot />
  </div>
</template>

<script>
import { useModalStore } from "~~/store/ModalStore";

export default {
  setup() {},
};
</script>

<style scoped>
.general {
  height: auto;
  width: auto;
  visibility: visible;
}
</style>
