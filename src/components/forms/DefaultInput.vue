<template>
  <div class="default-input d-flex flex-column">
    <label v-if="label && id" class="default-input__label" :for="id">{{
      label
    }}</label>
    <input
      :id="id"
      class="default-input__input"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :max="max"
      @input="update"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    label: { type: String, default: "" },
    show: { type: Boolean, default: true },
    placeholder: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    type: { type: String, default: "text" },
    disabled: { type: Boolean, default: false },
    max: { type: Number, default: null },
  },
  emits: ["update:modelValue"],
  methods: {
    update(event) {
      if (this.type === "number") {
        if (this.max && event.target.value > this.max) {
          event.target.value = this.max;
        }
        this.$emit("update:modelValue", parseInt(event.target.value));
      } else {
        this.$emit("update:modelValue", event.target.value);
      }
    },
  },
};
</script>

<style>
.default-input {
  margin-bottom: var(--spacing-size-1);
}
.default-input__label {
  font-size: var(--font-size-root);
  margin-bottom: calc(var(--spacing-size-1) / 2);
}
.default-input__input {
  padding: var(--default-input-padding);
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  outline: none;
  transition: all 0.2s ease-in-out;
}
.default-input__input:focus {
  border-color: var(--color-blue);
}
.default-input__input:disabled {
  opacity: 0.6;
}
</style>
