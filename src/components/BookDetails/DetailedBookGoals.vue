<template>
  <div class="detailed-book__goals d-flex my-1">
    <GoalsIcon class="detailed-book__goals-icon mr-1" />
    <InlineButton
      text="Set a date goal"
      color="green"
      underline
      @click="toggleUpdateGoal"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

import InlineButton from "../buttons/InlineButton.vue";
import GoalsIcon from "../icons/GoalsIcon.vue";

export default {
  components: {
    InlineButton,
    GoalsIcon,
  },
  methods: {
    ...mapMutations(["toggleUpdateGoal"]),
  },
};
</script>

<style>
.detailed-book__goals-icon {
  height: 50px;
  width: 50px;
}
</style>
