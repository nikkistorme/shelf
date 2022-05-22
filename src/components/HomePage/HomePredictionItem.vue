<template>
  <li class="home-predictions__item d-flex al-start mb-1">
    <PredictionsStar class="home-predictions__bullet mr-1" />
    <p>
      {{ prediction.timeRemaining.hoursRemaining }}h
      {{ prediction.timeRemaining.minutesRemaining }}m remaining in
      <span
        class="home-predictions__link"
        @click="getDetailedBook(prediction.id)"
        >{{ prediction.title }}</span
      >
      by <span>{{ prediction.author }}</span
      >. Read {{ prediction.overallPace.averagePagesPerDay }} pages today to
      keep your average pace and finish in
      {{ prediction.overallPace.remainingDays }} days!
    </p>
  </li>
</template>

<script>
import { mapActions } from "vuex";

import PredictionsStar from "../icons/PredictionsStar.vue";

export default {
  components: { PredictionsStar },
  props: {
    prediction: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  methods: {
    ...mapActions(["getDetailedBook"]),
  },
};
</script>

<style>
.home-predictions__bullet {
  height: 17px;
  min-width: 17px;
  width: 17px;
  margin-top: 3px;
}
.home-predictions__link {
  color: var(--color-primary);
  cursor: pointer;
}
</style>
