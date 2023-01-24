<template>
  <span class="tooltip">
    <slot />
  </span>
</template>

<script>
export default {
  setup() {},
};
</script>

<style>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  padding: var(--spacing-size-half);
  border-radius: 6px;
  background-color: var(--color-black);
  opacity: 0;
  transition: all 0.2s ease-in-out;
  z-index: var(--z-index-tooltip);
  white-space: nowrap;
  text-align: center;
  color: var(--color-white);
}
.tooltip-wrapper:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
