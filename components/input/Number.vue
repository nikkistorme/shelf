<template>
  <div class="number-input d-flex flex-column">
    <label v-show="label && id" class="number-input__label" :for="id">{{
      label
    }}</label>
    <input
      :id="id"
      class="number-input__input"
      type="number"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :max="max"
      :pattern="pattern"
      @input="update"
      @blur="runBlur"
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
    modelValue: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: null },
    blur: { type: Function, default: () => {} },
  },
  emits: ["update:modelValue", "blur:blur"],
  computed: {
    pattern() {
      return "\\d*";
    },
  },
  methods: {
    update(event) {
      if (this.max && event.target.value > this.max) {
        event.target.value = this.max;
      } else if (this.min && event.target.value < this.min) {
        event.target.value = this.min;
      }
      this.$emit("update:modelValue", parseInt(event.target.value));
    },
    runBlur() {
      this.$emit("blur:blur", this.blur());
    },
  },
};
</script>

<style>
.number-input__label {
  font-size: var(--font-size-root);
  margin-bottom: var(--spacing-size-half);
}
.number-input__input {
  max-width: 100px;
  padding: var(--default-input-padding);
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  outline: none;
  transition: all 0.2s ease-in-out;
}
.number-input__input:focus {
  border-color: var(--color-primary);
}
.number-input__input:disabled {
  opacity: 0.6;
}
</style>
