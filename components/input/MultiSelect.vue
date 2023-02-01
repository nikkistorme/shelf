<template>
  <div class="multi-select d-flex flex-column gap-half w-100">
    <fieldset class="p-0">
      <div
        v-for="(option, i) in options"
        :key="i"
        class="option d-flex gap-half"
      >
        <label :for="option.id">
          <input
            type="checkbox"
            :checked="value.includes(option.value)"
            :id="option.id"
            :name="option.label"
            :value="option.value"
            @input="(event) => check(option.value, event.target.checked)"
          />
          {{ option.label }}
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  props: {
    legend: {
      type: String,
      default: "Multi-select",
    },
    value: {
      type: Array,
      required: true,
      default: () => [],
    },
    options: {
      type: Array,
      required: true,
      default: () => [
        {
          id: "example-option-1",
          label: "Example option 1",
          value: "ms-example-1",
        },
        {
          id: "example-option-2",
          label: "Example option 2",
          value: "ms-example-2",
        },
      ],
    },
  },
  setup(props, context) {
    const check = (checkValue, checked) => {
      let updatedValue = [...props.value];
      if (checked) {
        updatedValue.push(checkValue);
      } else {
        updatedValue.splice(updatedValue.indexOf(checkValue), 1);
      }
      context.emit("update:value", updatedValue);
    };

    const cancel = () => {};
    const apply = () => {
      context.emit("update:value", updatedValue);
    };

    return { check, cancel, apply };
  },
};
</script>

<style scoped>
.multi-select {
  min-width: 200px;
}
fieldset {
  border: none;
}
label {
  white-space: nowrap;
}
</style>
