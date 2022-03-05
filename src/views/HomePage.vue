<template>
  <main class="home-page d-grid ji-center">
    <HomeShelf v-if="inProgressShelf" :shelf-id="inProgressShelf" />
    <HomeGoalStats />
    <HomePredictionStats />
    <HomeSocialStats />
  </main>
</template>

<script>
import { mapGetters } from "vuex";

import HomeShelf from "../components/HomePage/HomeShelf.vue";
import HomeGoalStats from "../components/HomePage/HomeGoalStats.vue";
import HomePredictionStats from "../components/HomePage/HomePredictionStats.vue";
import HomeSocialStats from "../components/HomePage/HomeSocialStats.vue";

export default {
  components: {
    HomeShelf,
    HomeGoalStats,
    HomePredictionStats,
    HomeSocialStats,
  },
  computed: {
    ...mapGetters(["getInProgressShelf"]),
    inProgressShelf() {
      return this.getInProgressShelf ? this.getInProgressShelf.id : "";
    },
  },
};
</script>

<style>
.home-page {
  grid-gap: var(--spacing-size-2);
  padding: var(--spacing-size-2) var(--spacing-size-1);
}
@media (min-width: 768px) {
  .home-page {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--spacing-size-4);
  }
}
.home-page__list-item {
  position: relative;
}
@media (min-width: 1350px) {
  .home-page {
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "shelf shelf goals social"
      ". . prediction social";
  }
  .home-shelf {
    grid-area: shelf;
  }
  .home-goals {
    grid-area: goals;
  }
  .home-predictions {
    grid-area: prediction;
  }
  .home-social {
    grid-area: social;
  }
}
</style>
