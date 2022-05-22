<template>
  <div class="default-button__wrapper">
    <button
      :class="[{ 'default-button': true }, color, flavor]"
      :disabled="disabled"
      :type="type"
      @click="clickAction"
    >
      {{ text }}
    </button>
  </div>
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
  width: fit-content;
  padding: var(--spacing-size-half);
  border: 2px solid transparent;
  border-radius: var(--border-radius-3);
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
  background: var(--color-primary);
  color: white;
}
.default-button.red {
  background: var(--color-red);
  color: white;
}
.default-button.yellow {
  background: var(--color-yellow);
}
.default-button.tiny {
  padding: var(--spacing-size-half);
  border-radius: var(--border-radius-3);
}
</style>
