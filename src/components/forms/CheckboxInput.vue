<template>
  <label class="checkbox-input"
    >{{ label }}
    <input
      :id="id"
      class="checkbox-input__input"
      :type="type"
      :checked="modelValue"
      :disabled="disabled"
      @change="update"
    />
    <span class="checkbox-input__custom"></span>
  </label>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    label: { type: String, default: "" },
    modelValue: { type: Boolean, default: false },
    type: { type: String, default: "checkbox" },
    disabled: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  methods: {
    update(event) {
      this.$emit("update:modelValue", event.target.checked);
    },
  },
};
</script>

<style>
.checkbox-input {
  display: block;
  position: relative;
  padding-left: calc(25px + (var(--spacing-size-half)));
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* Hide the browser's default checkbox */
.checkbox-input input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
/* Create a custom checkbox */
.checkbox-input__custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border-radius: 5px;
  background-color: var(--color-grey);
  transition: all 0.1s;
}
/* When the checkbox is checked, add a blue background */
.checkbox-input input:checked ~ .checkbox-input__custom {
  background-color: var(--color-primary);
}

/* Create the checkbox-input__custom/indicator (hidden when not checked) */
.checkbox-input__custom:after {
  content: "";
  position: absolute;
  top: 5px;
  left: 9px;
  display: block;
  height: 10px;
  width: 5px;
  border: solid white;
  border-width: 0 3px 3px 0;
  opacity: 0;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transition: all 0.1s ease-in-out;
}

/* Show the checkbox-input__custom when checked */
.checkbox-input input:checked ~ .checkbox-input__custom:after {
  opacity: 1;
}
</style>
