<template>
  <div v-if="userBook.id" class="book-page__goals d-flex ai-center gap-3 w-100">
    <IconGoals
      v-if="!userBook.goal?.goalDate"
      class="book-page__goals-icon mr-1"
    />
    <IconTarget
      v-if="userBook.goal?.goalDate"
      class="book-page__target-icon"
      :goal-date="userBook.goal?.goalDate"
    />
    <div v-if="goalIsValid" class="d-flex flex-column jc-center">
      <p>Page {{ userBook.goal.targetPage }} by {{ formattedGoalDate }}</p>
      <p>{{ goalPace.pagesPerDay }} pages / day</p>
      <!-- <p>
        <span v-if="goalPace.hoursPerDay > 0"
          >{{ goalPace.hoursPerDay }}h
        </span>
        <span v-if="goalPace.leftoverMinsPerDay"
          >{{ goalPace.leftoverMinsPerDay }}m / day</span
        >
      </p> -->
    </div>
    <ButtonDefault class="ml-auto" flavor="tiny" @click="openUpdateGoalModal">
      {{ userBook.goal?.targetDate ? "Update goal" : "Set goal" }}
    </ButtonDefault>
    <ModalUpdateGoal
      v-if="updatingGoal"
      :open="updatingGoal"
      :book="userBook"
    />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~~/store/BookStore";
import { useModalStore } from "~~/store/ModalStore";
import { getGoalPace } from "~~/services/statsService";
import { formatDate } from "~~/services/timeService";

export default {
  props: {
    book: Object,
  },
  setup(props) {
    const bookStore = useBookStore();
    const { userBook } = storeToRefs(bookStore);

    const goalIsValid = computed(() => {
      const goalExists = !!props.book.goal;
      const goalDateObject = new Date(userBook.value.goal?.goalDate);
      const todayDateObject = new Date();
      const goalIsInFuture = goalDateObject > todayDateObject;
      return goalExists && goalIsInFuture;
    });

    const formattedGoalDate = computed(() => {
      const goalDate = userBook.value.goal?.goalDate;
      return formatDate(goalDate);
    });

    const goalPace = computed(() => {
      if (props.book.goal) {
        return getGoalPace(props.book);
      } else {
        return 0;
      }
    });

    const updatingGoal = ref(false);
    const modalStore = useModalStore();

    function openUpdateGoalModal() {
      updatingGoal.value = true;
      modalStore.openModal();
    }

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        updatingGoal.value = false;
      }
    });

    return {
      userBook,
      formattedGoalDate,
      goalIsValid,
      goalPace,
      openUpdateGoalModal,
      updatingGoal,
    };
  },
};
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
