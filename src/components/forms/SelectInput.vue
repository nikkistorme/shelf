<template>
  <span class="select-input">
    <select
      :id="id"
      :name="inputName"
      :value="modelValue"
      class="select-input__input"
      align="center"
      @input="update"
    >
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option.value"
        :selected="option.value === modelValue"
        class="select-input__option"
      >
        {{ option.label }}
      </option>
    </select>
  </span>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    inputName: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    update(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style>
.select-input {
  height: min-content;
  width: min-content;
}
.select-input__input {
  padding: var(--default-input-padding);
  background-color: white;
  text-align: center;
  transition: all 0.2s ease-in-out;
}
.select-input__input:focus {
  border-color: var(--color-blue);
}
.select-input__option {
  border: none;
}
@supports (pointer-events: none) and (appearance: none) {
  .select-input {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .select-input__input {
    padding-right: calc(var(--spacing-size-2));
    border: var(--default-input-border);
    border-radius: var(--default-input-border-radius);
    appearance: none;
  }
  .select-input::before,
  .select-input::after {
    content: "";
    position: absolute;
    pointer-events: none;
  }
  .select-input::after {
    content: "\25BC";
    right: 0;
    top: calc(50% - 6px);
    right: 10px;
    height: 6px;
    width: 11px;
  }
  .select-input::before {
    width: 30px;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0 3px 3px 0;
  }
  .select-input__input[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .select-input__input[disabled]:before {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
