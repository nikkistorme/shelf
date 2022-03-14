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
      :max="max"
      :pattern="pattern"
      checked
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
    min: { type: Number, default: 0 },
    max: { type: Number, default: null },
  },
  emits: ["update:modelValue"],
  computed: {
    pattern() {
      switch (this.type) {
        case "number":
          return "\\d*";
        case "email":
          return "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$";
        case "password":
          return ".{8,}";
        default:
          return ".*";
      }
    },
  },
  methods: {
    update(event) {
      if (this.type === "number") {
        if (this.max && event.target.value > this.max) {
          event.target.value = this.max;
        } else if (this.min && event.target.value < this.min) {
          event.target.value = this.min;
        }
        this.$emit("update:modelValue", parseInt(event.target.value));
      } else if (this.type === "checkbox") {
        this.$emit("update:modelValue", event.target.checked);
      } else {
        this.$emit("update:modelValue", event.target.value);
      }
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
.default-input__input[type="checkbox"] {
  margin-right: var(--spacing-size-1);
}
.default-input__input:focus {
  border-color: var(--color-primary);
}
.default-input__input:disabled {
  opacity: 0.6;
}
</style>
