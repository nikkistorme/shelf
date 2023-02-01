<template>
  <div class="input-date w-100">
    <label v-show="label.length" :for="id">
      {{ label }}
    </label>
    <input
      type="text"
      class="input-date__input input-style-reset w-100"
      :id="id"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      :required="required"
      @input="(event) => input(event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: "" },
    id: { type: String, default: "" },
    placeholder: { type: String, default: "mm/dd/yyyy" },
    value: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  setup(props, context) {
    const checkValue = (str, max) => {
      if (str.charAt(0) !== "0" || str == "00") {
        let num = parseInt(str);
        if (isNaN(num) || num <= 0 || num > max) num = 1;
        if (
          num > parseInt(max.toString().charAt(0)) &&
          num.toString().length == 1
        )
          str = "0" + num;
        else str = num.toString();
      }
      return str;
    };

    const input = (event) => {
      const value = event.target.value;
      if (/\D\/$/.test(value)) value = value.substr(0, value.length - 3);
      let values = value.split("/").map((v) => v.replace(/\D/g, ""));

      if (values[0]) values[0] = checkValue(values[0], 12);
      if (values[1]) values[1] = checkValue(values[1], 31);

      const output = values.map((v, i) =>
        v.length == 2 && i < 2 ? v + "/" : v
      );

      event.target.value = output.join("").substr(0, 10);
      context.emit("update:value", event.target.value);
    };

    return { input };
  },
};
</script>

<style scoped>
.input-date__input {
  border: var(--default-input-border);
  border-radius: var(--default-input-border-radius);
  padding: 0 var(--spacing-size-half);
}
</style>
