<template>
  <button
    :class="[{ 'default-button': true }, color, flavor]"
    :disabled="disabled"
    :type="type"
    @click="clickAction"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: { type: String, default: "Button" },
    clickAction: { type: Function, default: () => {} },
    color: { type: String, default: "blue" },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: "button" },
    flavor: { type: String, default: "default" },
  },
};
</script>

<style scoped>
.default-button {
  height: min-content;
  width: auto;
  padding: calc(var(--spacing-size-1) / 2) var(--spacing-size-1);
  border: 2px solid transparent;
  border-radius: var(--border-radius-2);
  line-height: var(--font-size-root);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.default-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.default-button:not([disabled]):hover {
  filter: brightness(115%);
}
.default-button.blue {
  background: var(--color-blue);
  color: white;
}
.default-button.red {
  background: var(--color-red);
  color: white;
}
.default-button.tiny {
  padding: calc(var(--spacing-size-1) / 2);
  border-radius: var(--border-radius-3);
}
</style>
