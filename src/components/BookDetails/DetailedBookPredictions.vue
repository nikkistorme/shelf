<template>
  <div class="detailed-book__predictions d-flex">
    <PredictionsIcon class="detailed-book__predictions-icon mr-1" />
    <div>
      <p v-if="timeRemaining.minPerPage > 0" class="detailed-book__stats-text">
        {{ timeRemaining.minPerPage }} min/page
      </p>
      <p class="detailed-book__stats-text">
        <span
          v-if="timeRemaining.hoursRemaining > 0"
          class="detailed-book__hours-remaining"
          >{{ timeRemaining.hoursRemaining }}h
        </span>
        <span
          v-if="timeRemaining.minutesRemaining > 0"
          class="detailed-book__mins-remaining"
          >{{ timeRemaining.minutesRemaining }}m remaining</span
        >
      </p>
      <p v-if="overallPace.averagePagesPerDay > 0">
        <span class="detailed-book__pace">
          Continue at ~{{ overallPace.averagePagesPerDay }}
          pages/day to finish
        </span>
        <span
          v-if="overallPace.remainingDays > 0"
          class="detailed-book__days-remaining"
        >
          in {{ overallPace.remainingDays }} days</span
        >
        <span v-else> today!</span>
      </p>
      <p v-if="noPredictions">Log reading sessions for predictions</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import statsService from "../../services/statsService";

import PredictionsIcon from "../icons/PredictionsIcon.vue";

export default {
  components: {
    PredictionsIcon,
  },
  computed: {
    ...mapGetters(["detailedBook"]),
    timeRemaining() {
      return statsService.timeRemaining(this.detailedBook);
    },
    overallPace() {
      return statsService.overallPace(this.detailedBook);
    },
    noPredictions() {
      return (
        !this.timeRemaining.minPerPage > 0 &&
        !this.timeRemaining.hoursRemaining > 0 &&
        !this.timeRemaining.minutesRemaining > 0 &&
        !this.overallPace.averagePagesPerDay > 0
      );
    },
  },
  methods: {
    test() {
      console.log("test");
    },
  },
};
</script>

<style>
.detailed-book__predictions {
  margin-top: calc(var(--spacing-size-2) - 9px);
}
.detailed-book__predictions-icon {
  min-width: 58px;
  margin-left: -6px;
}
</style>
