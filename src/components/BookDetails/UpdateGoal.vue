<template>
  <div class="update-goal" :class="{ open: updateGoalOpen }">
    <form class="update-goal__form" @submit.prevent="updateGoal"></form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["updateGoalOpen"]),
  },
  watch: {
    updateGoalOpen(newValue) {
      if (newValue) {
        document.querySelector(".update-goal").style.height =
          document.querySelector(".update-goal__form").scrollHeight + "px";
      } else {
        document.querySelector(".update-goal").style.height = "0px";
      }
    },
  },
  methods: {
    ...mapMutations(["toggleUpdateGoal"]),
    updateGoal() {
      this.toggleUpdateGoal();
    },
  },
};
</script>

<style>
.update-goal {
  height: 0;
  overflow: hidden;
  transition: height 0.4s ease;
}
.update-goal__form {
  height: 200px;
}
</style>
