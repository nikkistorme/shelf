<template>
  <button
    type="button"
    class="inline-button"
    :class="[{ underline: underline }, color]"
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
    underline: { type: Boolean, default: false },
    color: { type: String, default: "" },
  },
};
</script>

<style scoped>
.inline-button {
  display: inline;
  height: min-content;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  text-align: left;
  font-weight: 700;
}
.inline-button.underline {
  text-decoration: underline;
  text-decoration-style: dotted;
}
.inline-button.green {
  color: var(--color-green);
}
.inline-button.blue {
  color: var(--color-primary);
}
.inline-button.red {
  color: var(--color-red);
}
</style>
