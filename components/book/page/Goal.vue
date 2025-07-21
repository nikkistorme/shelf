<template>
  <div v-if="userBook?.id" class="book-page__goals d-flex ai-center w-100">
    <IconGoals
      v-if="!userBook.goal?.goal_date"
      class="book-page__goals-icon mr-1"
    />
    <IconTarget
      v-if="userBook.goal?.goal_date"
      class="book-page__target-icon"
      :goal-date="userBook.goal?.goal_date"
    />
    <div v-if="goalIsValid" class="d-flex flex-column jc-center">
      <p>
        Page {{ userBook.goal.target_page }}
        <br />
        <span>by {{ formattedGoalDate }}</span>
      </p>
      <p v-if="goalPace?.pagesPerDay">{{ goalPace.pagesPerDay }} pages / day</p>
      <!-- <p>
        <span v-if="goalPace.hoursPerDay > 0"
          >{{ goalPace.hoursPerDay }}h
        </span>
        <span v-if="goalPace.leftoverMinsPerDay"
          >{{ goalPace.leftoverMinsPerDay }}m / day</span
        >
      </p> -->
    </div>
    <ButtonDefault class="ml-auto" flavor="tiny" @click="updatingGoal = true">
      {{ userBook.goal?.goal_date ? "Update goal" : "Set goal" }}
    </ButtonDefault>
    <ModalGeneral :show="updatingGoal" :close="() => (updatingGoal = false)">
      <template #content>
        <BookUpdateGoal :book="userBook" />
      </template>
    </ModalGeneral>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookStore } from "~~/store/BookStore";
import { getGoalPace } from "~~/services/statsService";
import { formatDate } from "~~/services/timeService";

interface GoalPace {
  pagesPerDay: number;
  hoursPerDay: number;
  leftoverMinsPerDay: number;
}

const props = defineProps<{
  book: UserBook;
}>();

const bookStore = useBookStore();
const { userBook } = storeToRefs(bookStore);

const goalIsValid = computed((): boolean => {
  const goalExists = !!props.book.goal;
  if (!userBook?.value?.goal?.goal_date) return false;
  const goalDateObject = new Date(userBook.value.goal?.goal_date);
  const todayDateObject = new Date();
  const goalIsInFuture = goalDateObject > todayDateObject;
  return goalExists && goalIsInFuture;
});

const formattedGoalDate = computed((): string => {
  if (!userBook?.value?.goal?.goal_date) return "";
  const goalDate = userBook.value.goal?.goal_date;
  return formatDate(goalDate);
});
const goalPace = computed((): GoalPace | null => {
  if (props?.book?.goal) {
    return getGoalPace(props.book);
  } else {
    return null;
  }
});
const updatingGoal = ref(false);
</script>

<style>
.book-page__goals {
  max-width: 350px;
  border-bottom: var(--default-input-border);
}
.book-page__goals-icon {
  height: 50px;
  width: 50px;
}
.book-page__target-icon {
  margin-right: calc(var(--spacing-size-2) - 13px);
  font-size: calc(var(--font-size-1) - 2px);
}
</style>
