<template>
  <div class="add-option-button__wrapper d-flex">
    <AddButtonIcon class="add-option-button h-100" />
    <InlineButton v-if="text" :text="text" color="blue" underline />
    <select
      :id="id"
      :name="inputName"
      class="add-option-button__select h-100 w-100 cursor-pointer"
      @input="update"
    >
      <option selected="true" style="display: none"></option>
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
  </div>
</template>

<script>
import AddButtonIcon from "../icons/AddButtonIcon.vue";
import InlineButton from "./InlineButton.vue";

export default {
  components: { AddButtonIcon, InlineButton },
  props: {
    id: { type: String, default: "" },
    inputName: { type: String, default: "" },
    text: { type: String, default: "" },
    modelValue: { type: String, default: "" },
    options: {
      type: Array,
      required: true,
      default: () => [],
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
.add-option-button__wrapper {
  position: relative;
  gap: var(--spacing-size-half);
  height: 30px;
}
.add-option-button__select {
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
}
</style>
