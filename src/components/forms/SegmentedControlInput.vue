<template>
  <div class="segmented-control">
    <p v-if="topLabel" class="segmented-control__top-label">{{ topLabel }}</p>
    <div v-if="options?.length > 0" class="segmented-control__control d-flex">
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
        <label :for="option.value" class="segmented-control__label w-100">{{
          option.label
        }}</label>
      </div>
      <div
        class="segmented-control__background h-100"
        :style="backgroundStyles"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
    topLabel: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  computed: {
    backgroundStyles() {
      return {
        width: `calc(100% / ${this.options.length})`,
        transform: `translateX(${this.activeOptionIndex * 100}%)`,
      };
    },
    activeOptionIndex() {
      return this.options.findIndex(
        (option) => option.value === this.modelValue
      );
    },
  },
  methods: {
    update(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style>
.segmented-control {
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  overflow: hidden;
}
.segmented-control__control {
  position: relative;
  border-radius: calc(var(--default-input-border-radius) - 2px);
  z-index: 5;
}
.segmented-control__option {
  flex: 1;
}
.segmented-control__input {
  display: none;
}
.segmented-control__background,
.segmented-control__label {
  text-align: center;
  display: inline-block;
  padding: var(--spacing-size-half) 0;
  margin-right: -3px;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.segmented-control__label {
  line-height: var(--font-size-1);
}
.segmented-control__background {
  background-color: var(--color-primary);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: -1;
  border-radius: calc(var(--default-input-border-radius) - 2px);
}
.segmented-control__input:checked + label {
  color: white;
}
</style>
