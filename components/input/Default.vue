<template>
  <div class="default-input d-flex flex-column">
    <label v-show="label && id" class="default-input__label" :for="id">{{
      label
    }}</label>
    <input
      :id="id"
      class="default-input__input"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :pattern="pattern"
      :required="required"
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
    modelValue: { type: String, default: "" },
    type: { type: String, default: "text" },
    disabled: { type: Boolean, default: false },
    blur: { type: Function, default: () => {} },
    required: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "blur:blur"],
  computed: {
    pattern() {
      switch (this.type) {
        case "email":
          return "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$";
        default:
          return ".*";
      }
    },
  },
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
.default-input__label {
  font-size: var(--font-size-root);
  margin-bottom: var(--spacing-size-half);
}
.default-input__input {
  padding: var(--default-input-padding);
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  outline: none;
  transition: all 0.2s ease-in-out;
}
.default-input__input:focus {
  border-color: var(--color-primary);
}
.default-input__input:disabled {
  opacity: 0.6;
}
</style>
