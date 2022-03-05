<template>
  <div
    class="detailed-book__stats w-100"
    :class="{ 'split-1': updateProgressOpen, 'split-2': updateGoalOpen }"
  >
    <div class="split-card-top w-100 d-flex flex-column">
      <DetailedBookProgress />
    </div>
    <UpdateProgress />
    <div class="split-card-middle w-100 d-flex">
      <DetailedBookGoals />
    </div>
    <UpdateGoal />
    <div class="split-card-bottom w-100 d-flex mb-2">
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
.detailed-book__stats-text {
  margin-bottom: calc(var(--spacing-size-1) / 4);
}
</style>
