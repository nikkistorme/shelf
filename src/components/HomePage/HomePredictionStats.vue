<template>
  <div class="home-predictions card d-flex flex-column al-center w-100">
    <PredictionsIcon />
    <ul class="home-predictions__list w-100 mt-2">
      <HomePredictionItem
        v-for="(p, i) in predictions"
        :key="i"
        :prediction="p"
      />
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import statsService from "../../services/statsService";

import PredictionsIcon from "../icons/PredictionsIcon.vue";
import HomePredictionItem from "./HomePredictionItem.vue";

export default {
  components: { PredictionsIcon, HomePredictionItem },
  computed: {
    ...mapGetters(["inProgressBooks"]),
    predictions() {
      let predictions = [];
      const firstTwoInProgressBooks = this.inProgressBooks
        .filter(
          (book) => statsService.changesWithDuration(book.changes).length > 0
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      firstTwoInProgressBooks.forEach((book) => {
        let p = {
          title: book.title,
          author: book.author,
          timeRemaining: statsService.timeRemaining(book),
          overallPace: statsService.overallPace(book),
        };
        predictions.push(p);
      });
      return predictions;
    },
  },
};
</script>

<style>
.home-predictions {
  padding-top: var(--spacing-size-2);
}
</style>
