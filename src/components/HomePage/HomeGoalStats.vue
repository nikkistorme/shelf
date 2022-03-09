<template>
  <div class="home-goals card d-flex flex-column ai-center w-100">
    <GoalsIcon @click="test" />
    <ul
      class="home-goals__list w-100 mt-2"
      :class="{ 'd-flex flex-column': booksWithGoals.length < 1 }"
    >
      <li class="home-goals__item d-flex al-start mb-1">
        <div class="home-goals__bullet mr-1"></div>
        <p>You’ve read {{ pagesReadToday }} pages today</p>
      </li>
      <div v-if="booksWithGoals.length < 1">
        <li class="home-goals__item d-flex al-start mb-1">
          <div class="home-goals__bullet mr-1"></div>
          <p>You've read {{ pagesReadThisWeek }} pages this week</p>
        </li>
        <li class="home-goals__item">
          <p>
            <i
              >Assign target dates to your in progress books for information
              about hitting your goals</i
            >
          </p>
        </li>
      </div>
      <div v-if="booksWithGoals.length > 0">
        <li
          v-for="(book, i) in booksWithGoals"
          :key="i"
          class="home-goals__item d-flex al-start mb-1"
        >
          <div class="home-goals__bullet mr-1"></div>
          <p v-if="pagesRemainingToday(book) > 0">
            Read {{ pagesRemainingToday(book) }} more pages of
            <strong>{{ book.title }}</strong> by
            <strong>{{ book.author }}</strong> today for your goal date of
            {{ formattedDate(book.goal.goalDate) }}
          </p>
          <p v-else>
            On track to finish
            <strong>{{ book.title }}</strong> by
            <strong>{{ book.author }}</strong> by
            <span> {{ formattedDate(book.goal.goalDate) }}</span>
          </p>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import statsService from "../../services/statsService.js";
import GoalsIcon from "../icons/GoalsIcon.vue";

export default {
  components: { GoalsIcon },
  computed: {
    ...mapGetters(["getInProgressShelf", "books"]),
    pagesReadToday() {
      return statsService.pagesReadToday(this.books);
    },
    pagesReadThisWeek() {
      return statsService.pagesReadThisWeek(this.books);
    },
    booksWithGoals() {
      console.log(statsService.getBooksWithGoals(this.books));
      return statsService
        .getBooksWithGoals(this.books)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
    },
  },
  methods: {
    test() {
      console.log("🚀 ~ booksWithGoals", this.booksWithGoals);
    },
    pagesRemainingToday(book) {
      console.log("🚀 ~ book", book);
      const pagesReadToday = statsService.pagesReadToday([book]);
      const goalPace = statsService.goalPace(book);
      return goalPace.pagesPerDay - pagesReadToday;
    },
    formattedDate(date) {
      return statsService.getFormattedDate(date);
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
  border: 4px solid var(--color-blue);
}
</style>
