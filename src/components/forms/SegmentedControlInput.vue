<template>
  <div class="segmented-control">
    <div
      v-for="(option, i) in options"
      :key="i"
      class="segmented-control__option"
    >
      <input
        :id="option.value"
        :value="option.value"
        :name="id"
        type="radio"
        class="segmented-control__input"
        :checked="option.value === modelValue"
        @change="update"
      />
      <label :for="option.value" class="segmented-control__label">{{
        option.label
      }}</label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
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
.segmented-control {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 100%;
  user-select: none;
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  overflow: hidden;
}
.segmented-control::before {
}
.segmented-control__option {
  flex: 1;
  text-align: center;
}
.segmented-control__input {
  display: none;
}
.segmented-control__input:checked + label {
  background-color: var(--color-blue);
  color: white;
}
.segmented-control__label {
  display: block;
  padding: calc(var(--spacing-size-1) / 4) 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 250ms cubic-bezier(0, 0.95, 0.38, 0.98);
}

/* .segmented-control__label:last-of-type::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  margin: 0px;
  z-index: -1;
  transform: translateX(0);
}
.segmented-control__label::before {
  background: var(--color-blue);
  transition: all 250ms cubic-bezier(0, 0.95, 0.38, 0.98);
}
.segmented-control
  > .segmented-control__input:nth-of-type(1):checked
  ~ label:last-of-type::before {
  transform: translateX(calc(0% + 0px));
} */
</style>
