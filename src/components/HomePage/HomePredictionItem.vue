<template>
  <li class="home-predictions__item d-flex al-start mb-1">
    <PredictionsStar class="home-predictions__bullet mr-1" />
    <p>
      {{ prediction.timeRemaining.hoursRemaining }}h
      {{ prediction.timeRemaining.minutesRemaining }}m remaining in
      <strong>{{ prediction.title }}</strong> by
      <strong>{{ prediction.author }}</strong
      >. Read {{ prediction.overallPace.averagePagesPerDay }} pages today to
      keep your average pace and finish in
      {{ prediction.overallPace.remainingDays }} days!
    </p>
  </li>
</template>

<script>
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
};
</script>

<style>
.home-predictions__bullet {
  height: 17px;
  min-width: 17px;
  width: 17px;
  margin-top: 3px;
}
</style>
