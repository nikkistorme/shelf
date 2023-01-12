<template>
  <div class="textarea-input d-flex flex-column">
    <label v-show="label && id" class="textarea-input__label" :for="id">{{
      label
    }}</label>
    <textarea
      :id="id"
      class="textarea-input__input"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="update"
      @blur="runBlur"
      col="8"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    blur: { type: Function, default: () => {} },
  },
  emits: ["update:modelValue", "blur:blur"],
  methods: {
    update(event) {
      this.$emit("update:modelValue", event.target.value);
    },
    runBlur() {
      this.$emit("blur:blur", this.blur());
    },
  },
};
</script>

<style>
.textarea-input__label {
  font-size: var(--font-size-root);
  margin-bottom: var(--spacing-size-half);
}
.textarea-input__input {
  padding: var(--default-input-padding);
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  outline: none;
  transition: all 0.2s ease-in-out;
}
.textarea-input__input:focus {
  border-color: var(--color-primary);
}
.textarea-input__input:disabled {
  opacity: 0.6;
}
</style>
