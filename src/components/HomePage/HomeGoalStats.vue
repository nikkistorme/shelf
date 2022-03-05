<template>
  <div class="home-goals card d-flex flex-column al-center w-100">
    <GoalsIcon @click="test" />
    <ul
      class="home-goals__list w-100 mt-2"
      :class="{ 'd-flex flex-column al-center': goals < 1 }"
    >
      <li class="home-goals__item d-flex al-start mb-1">
        <div class="home-goals__bullet mr-1"></div>
        <p>You’ve read {{ pagesReadToday }} pages today</p>
      </li>
      <li v-if="goals < 1" class="home-goals__item">
        <p>
          <i
            >Assign target dates to your in progress books for information about
            hitting your goals</i
          >
        </p>
      </li>
      <!-- <li class="home-goals__item d-flex al-start mb-1">
        <div class="home-goals__bullet mr-1"></div>
        <p>Read 11 more pages of Lamb today for your goal date of 09/23/2022</p>
      </li>
      <li class="home-goals__item d-flex al-start mb-1">
        <div class="home-goals__bullet mr-1"></div>
        <p>
          Read 21 pages of Harrow the Ninth today for your goal date of
          02/28/2022
        </p>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import GoalsIcon from "../icons/GoalsIcon.vue";

import statsService from "../../services/statsService.js";

export default {
  components: { GoalsIcon },
  computed: {
    ...mapGetters(["getInProgressShelf", "books"]),
    pagesReadToday() {
      return statsService.pagesReadToday(this.books);
      // return 0;
    },
    goals() {
      return 0;
    },
  },
  methods: {
    test() {
      console.log("🚀 ~ this.books", this.books);
    },
  },
};
</script>

<style>
.home-goals__bullet {
  height: 17px;
  min-width: 17px;
  width: 17px;
  margin-top: 5px;
  border-radius: 50%;
  border: 4px solid var(--color-green);
}
</style>
