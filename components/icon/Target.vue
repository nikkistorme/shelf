<template>
  <div class="target-icon" :data-month="goalDateMonth" :data-day="goalDateDay">
    <div class="target-icon__date d-flex flex-column jc-center ai-center">
      <span>{{ goalDateMonth }}</span>
      <span>{{ goalDateDay }}</span>
    </div>
    <svg
      width="63"
      height="62"
      viewBox="0 0 63 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="test"
    >
      <circle cx="26" cy="35.9971" r="24" stroke="#327fb7" stroke-width="4" />
      <path
        d="M54.3394 2.16133L53.9768 9.4395L61.5283 9.68411L55.8864 14.7722L48.9843 14.2046L48.7388 7.2835L54.3394 2.16133Z"
        fill="black"
        stroke="black"
      />
      <line
        x1="53.874"
        y1="9.33081"
        x2="41.8658"
        y2="20.7921"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    goalDate: {
      type: String,
      default: null,
    },
  },
  computed: {
    goalDateMonth() {
      console.log("🚀 ~ this.goalDate", this.goalDate);
      if (this.goalDate) {
        const date = new Date(this.goalDate);
        const month = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(date);
        return month;
      } else {
        return "";
      }
    },
    goalDateDay() {
      if (this.goalDate) {
        const date = new Date(this.goalDate);
        const day = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
        }).format(date);
        return day;
      } else {
        return "";
      }
    },
  },
  methods: {
    test() {
      console.log("🚀 ~ goalDateMonth", this.goalDateMonth);
    },
  },
};
</script>

<style>
.target-icon {
  position: relative;
}
.target-icon circle {
  stroke: var(--color-primary);
}
.target-icon__date {
  position: absolute;
  top: 3px;
  right: 6px;
  height: 100%;
  width: 100%;
}
</style>
