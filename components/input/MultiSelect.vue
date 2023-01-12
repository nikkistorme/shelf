<template>
  <div class="multi-select d-flex flex-column gap-half w-100">
    <!-- <div role="status" id="applied-filters">
      <ul v-if="value?.length" class="d-flex gap-half flex-wrap">
        <li v-for="(v, i) in value" :key="i">
          {{
            `${options.find((o) => o.value === v).label}${
              i < value.length - 1 ? ", " : ""
            }`
          }}
        </li>
      </ul>
    </div> -->
    <fieldset class="p-0">
      <!-- <legend>{{ legend }}</legend> -->
      <div
        v-for="(option, i) in options"
        :key="i"
        class="option d-flex gap-half"
      >
        <input
          type="checkbox"
          :checked="value.includes(option.value)"
          :id="option.id"
          :name="option.label"
          :value="option.value"
          @input="(event) => check(option.value, event.target.checked)"
        />
        <label :for="option.label">{{ option.label }}</label>
      </div>
    </fieldset>
    <!-- <div class="buttons d-flex jc-between">
      <ButtonDefault @click="cancel" color="red">Cancel</ButtonDefault>
      <ButtonDefault @click="apply">Apply</ButtonDefault>
    </div> -->
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
/* .multi-select {
  position: relative;
  border: var(--border-1);
  border-radius: var(--border-radius-1);
} */

fieldset {
  border: none;
}

/* legend {
  position: absolute;
  top: calc(-1 * var(--spacing-size-1));
  left: var(--spacing-size-1);
  background: var(--color-white);
} */
</style>
