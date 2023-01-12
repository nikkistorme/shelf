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
      <li class="home-goals__item d-flex al-start mb-1">
        <div class="home-goals__bullet mr-1"></div>
        <p>You've read {{ pagesReadThisWeek }} pages this week</p>
      </li>
      <li
        v-for="(book, i) in booksWithGoals"
        :key="i"
        class="home-goals__item d-flex al-start mb-1"
      >
        <div class="home-goals__bullet mr-1"></div>
        <p v-if="pagesRemainingToday(book) > 0">
          Read {{ pagesRemainingToday(book) }} more pages of
          <span class="home-goals__link" @click="getDetailedBook(book.id)">{{
            book.title
          }}</span>
          by <span>{{ book.author }}</span>
          today for your goal date of
          {{ formattedDate(book.goal.goalDate) }}
        </p>
        <p v-else>
          On track to finish
          <span class="home-goals__link" @click="getDetailedBook(book.id)">{{
            book.title
          }}</span>
          by <span>{{ book.author }}</span> by
          <span> {{ formattedDate(book.goal.goalDate) }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

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
      return statsService
        .getBooksWithGoals(this.books)
        .sort((a, b) => a.title > b.title)
        .slice(0, 2);
    },
  },
  methods: {
    ...mapActions(["getDetailedBook"]),
    test() {
      console.log("🚀 ~ booksWithGoals", this.booksWithGoals);
    },
    pagesRemainingToday(book) {
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
  border: 4px solid var(--color-primary);
}
.home-goals__link {
  color: var(--color-primary);
  cursor: pointer;
}
</style>
