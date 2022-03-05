<template>
  <div class="detailed-book__progress d-flex mb-1">
    <ProgressCircle class="mr-1" :percent="percentComplete" />
    <div>
      <p class="detailed-book__stats-text">
        {{ detailedBook.readPages }} / {{ detailedBook.totalPages }}
      </p>
      <p>{{ pagesReadToday }} pages read today</p>
    </div>
    <DefaultButton
      :text="updateProgressOpen ? 'Cancel' : 'Update'"
      flavor="tiny"
      class="ml-auto"
      :color="updateProgressOpen ? 'red' : 'blue'"
      @click="toggleUpdateProgress"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import statsService from "../../services/statsService.js";

import ProgressCircle from "./ProgressCircle.vue";
import DefaultButton from "../buttons/DefaultButton.vue";

export default {
  components: {
    ProgressCircle,
    DefaultButton,
  },
  computed: {
    ...mapGetters(["detailedBook", "updateProgressOpen"]),
    percentComplete() {
      if (this.detailedBook.totalPages && this.detailedBook.readPages) {
        let percent =
          this.detailedBook.readPages / this.detailedBook.totalPages;
        percent = Math.round(percent * 100);
        return percent;
      } else {
        return 0;
      }
    },
    pagesReadToday() {
      return statsService.pagesReadToday([this.detailedBook]);
    },
  },
  methods: {
    ...mapMutations(["toggleUpdateProgress"]),
  },
};
</script>

<style></style>
