<template>
  <div class="c100 small" :class="`p${percent}`">
    <span>{{ percent }}%</span>
    <div class="slice">
      <div class="bar"></div>
      <div class="fill"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      required: true
    }
  }
};
</script>
