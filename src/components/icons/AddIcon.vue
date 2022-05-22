<template>
  <svg
    class="add-icon"
    :class="[color]"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="19"
      y1="12"
      x2="19"
      y2="26"
      stroke="blue"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="12"
      y1="19"
      x2="26"
      y2="19"
      stroke="blue"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.add-icon.secondary line {
  stroke: var(--color-primary) !important;
}
</style>
