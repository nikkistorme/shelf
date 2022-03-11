<template>
  <div class="detailed-book__goals d-flex ai-center w-100 my-1">
    <GoalsIcon
      v-if="!detailedBook.goal?.goalDate"
      class="detailed-book__goals-icon mr-1"
    />
    <TargetIcon
      v-if="detailedBook.goal?.goalDate"
      class="detailed-book__target-icon"
      :goal-date="detailedBook.goal?.goalDate"
    />
    <div v-if="goalIsValid" class="d-flex flex-column jc-center">
      <p>{{ goalPace.pagesPerDay }} pages / day</p>
      <p>
        <span v-if="goalPace.hoursPerDay > 0"
          >{{ goalPace.hoursPerDay }}h
        </span>
        <span v-if="goalPace.leftoverMinsPerDay"
          >{{ goalPace.leftoverMinsPerDay }}m / day</span
        >
      </p>
    </div>
    <DefaultButton
      :text="updateGoalOpen ? 'Cancel' : 'Set goal'"
      :color="updateGoalOpen ? 'red' : 'blue'"
      class="ml-auto"
      flavor="tiny"
      @click="toggleUpdateGoal"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import statsService from "../../services/statsService";

import DefaultButton from "../buttons/DefaultButton.vue";
import GoalsIcon from "../icons/GoalsIcon.vue";
import TargetIcon from "./TargetIcon.vue";

export default {
  components: {
    DefaultButton,
    GoalsIcon,
    TargetIcon,
  },
  data() {
    return {
      goalDate: null,
    };
  },
  computed: {
    ...mapGetters(["detailedBook", "updateGoalOpen"]),
    goalPace() {
      if (this.detailedBook.goal) {
        return statsService.goalPace(this.detailedBook);
      } else {
        return 0;
      }
    },
    goalIsValid() {
      const goalExists = this.detailedBook.goal;
      const goalIsInFuture = this.detailedBook.goal?.goalDate > Date.now();
      return goalExists && goalIsInFuture;
    },
  },
  methods: {
    ...mapMutations(["setUpdateGoalVisible"]),
    toggleUpdateGoal() {
      if (!this.updateGoalOpen) {
        this.setUpdateGoalVisible(true);
      } else {
        this.setUpdateGoalVisible(false);
      }
    },
    selectDate() {
      this.goalDate = Date.now();
      this.toggleUpdateGoal();
    },
  },
};
</script>

<style>
.detailed-book__goals-icon {
  height: 50px;
  width: 50px;
}
.detailed-book__target-icon {
  margin-right: calc(var(--spacing-size-2) - 13px);
  font-size: calc(var(--font-size-1) - 2px);
}
</style>
