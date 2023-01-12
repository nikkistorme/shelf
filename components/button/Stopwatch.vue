<template>
  <button
    class="icon-button d-flex jc-center ai-center"
    :class="color"
    :disabled="disabled"
    :type="type"
  >
    <IconStopwatch />
  </button>
</template>

<script>
export default {
  props: {
    color: { type: String, default: "blue" },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: "button" },
  },
};
</script>

<style>
.icon-button {
  height: 50px;
  width: 50px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  background: var(--color-primary);
  line-height: var(--font-size-root);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.icon-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.icon-button:not([disabled]):hover {
  filter: brightness(115%);
}
.icon-button.blue *,
.icon-button.red * {
  stroke: white;
}
.icon-button.blue path,
.icon-button.red path {
  fill: white;
}
.icon-button.red {
  background: var(--color-red);
  color: white;
}
</style>
