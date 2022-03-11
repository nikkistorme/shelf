<template>
  <div
    class="book-details__stats w-100"
    :class="{ 'split-1': updateProgressOpen, 'split-2': updateGoalOpen }"
  >
    <div class="split-card-top w-100 d-flex flex-column">
      <DetailedBookProgress />
      <hr
        class="book-details__stats-divide"
        :class="{ hidden: updateProgressOpen }"
      />
    </div>
    <UpdateProgress />
    <div class="split-card-middle w-100 d-flex flex-column">
      <DetailedBookGoals />
      <hr
        class="book-details__stats-divide"
        :class="{ hidden: updateGoalOpen }"
      />
    </div>
    <UpdateGoal />
    <div class="split-card-bottom w-100 d-flex">
      <DetailedBookPredictions />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import DetailedBookProgress from "./DetailedBookProgress.vue";
import UpdateProgress from "./UpdateProgress.vue";
import DetailedBookGoals from "./DetailedBookGoals.vue";
import DetailedBookPredictions from "./DetailedBookPredictions.vue";
import UpdateGoal from "./UpdateGoal.vue";

export default {
  components: {
    UpdateProgress,
    DetailedBookProgress,
    DetailedBookGoals,
    DetailedBookPredictions,
    UpdateGoal,
  },
  computed: {
    ...mapGetters(["updateProgressOpen", "updateGoalOpen"]),
  },
};
</script>

<style>
.book-details__stats-text {
  margin-bottom: calc(var(--spacing-size-1) / 4);
}
.book-details__stats-divide {
  margin: 0;
  transition: all 0.2s 0.3s ease-in-out;
}
.book-details__stats-divide.hidden {
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
</style>
