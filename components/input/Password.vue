<template>
  <div class="password-input d-flex flex-column">
    <label v-show="label && id" class="password-input__label" :for="id">{{
      label
    }}</label>
    <input
      :id="id"
      class="password-input__input"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="update"
      @blur="runBlur"
    />
    <ButtonInline
      color="blue"
      :text="type === 'password' ? 'Show' : 'Hide'"
      class="password-input__toggle-button"
      @click="togglePasswordDisplay"
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
  data() {
    return {
      type: "password",
    };
  },
  methods: {
    togglePasswordDisplay() {
      this.type = this.type === "password" ? "text" : "password";
    },
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
.password-input {
  position: relative;
}
.password-input__label {
  font-size: var(--font-size-root);
  margin-bottom: var(--spacing-size-half);
}
.password-input__input {
  padding: var(--spacing-size-half) var(--spacing-size-4)
    var(--spacing-size-half) var(--spacing-size-1);
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  outline: none;
  transition: all 0.2s ease-in-out;
}
.password-input__input:focus {
  border-color: var(--color-primary);
}
.password-input__input:disabled {
  opacity: 0.6;
}
.password-input__toggle-button {
  position: absolute;
  top: 45px;
  right: var(--spacing-size-1);
}
</style>
