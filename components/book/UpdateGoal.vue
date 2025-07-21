<template>
  <div class="update-goal">
    <form
      class="update-goal__form d-flex flex-column gap-1"
      @submit.prevent="updateGoal"
    >
      <InputNumber
        id="goal-target-page"
        v-model="targetPage"
        label="Target Page"
        class="update-goal__input-page"
        :max="props.book.total_pages"
      />
      <InputDefault
        id="goal-date"
        v-model="goalDate"
        label="Target Date"
        class="update-goal__input"
        type="date"
      />
      <div class="d-flex jc-space-around mb-1">
        <ButtonInline
          text="2 weeks"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToTwoWeeks"
        />
        <ButtonInline
          text="1 month"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToOneMonth"
        />
        <ButtonInline
          text="2 months"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToTwoMonths"
        />
      </div>
      <div class="d-flex jc-between ai-center">
        <ButtonInline
          color="red"
          underline
          text="Remove goal"
          @click="removeGoal"
        ></ButtonInline>
        <ButtonDefault
          :disabled="disableUpdateGoal"
          type="submit"
          flavor="tiny"
        >
          Set Goal
        </ButtonDefault>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { newChange, sortChanges } from "~~/services/changeService";
import { useBookStore } from "~/store/BookStore";
import { useModalStore } from "~~/store/ModalStore";

const props = defineProps<{
  book: UserBook;
}>();

const setDate = (timestamp: number | null = null): string => {
  if (timestamp) {
    const day = new Date(timestamp);
    const year = day.getFullYear();
    const month = `${day.getMonth() + 1 <= 9 ? "0" : ""}${day.getMonth() + 1}`;
    const dayString = `${day.getDate() <= 9 ? "0" : ""}${day.getDate()}`;
    return `${year}-${month}-${dayString}`;
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1 <= 9 ? "0" : ""}${
      today.getMonth() + 1
    }`;
    const dayString = `${today.getDate() <= 9 ? "0" : ""}${today.getDate()}`;
    return `${year}-${month}-${dayString}`;
  }
};

const targetPage = ref(props.book.total_pages);
const goalDate = ref(setDate());

function setGoalToTwoWeeks(): void {
  goalDate.value = setDate(Date.now() + 12096e5);
}

function setGoalToOneMonth(): void {
  goalDate.value = setDate(Date.now() + 2628e6);
}

function setGoalToTwoMonths(): void {
  goalDate.value = setDate(Date.now() + 5256e6);
}

const disableUpdateGoal = computed((): boolean => {
  return (
    targetPage.value < props.book.current_page ||
    new Date(goalDate.value) < new Date(setDate())
  );
});

const bookStore = useBookStore();
const modalStore = useModalStore();
async function updateGoal(): Promise<void> {
  const newGoal = {
    target_page: targetPage.value,
    goal_date: new Date(goalDate.value).toISOString(),
    start_date: new Date().toISOString(),
  };
  const change = newChange("setGoal", props.book, {
    targetPage: newGoal.target_page,
    goalDate: newGoal.goal_date,
    oldGoal: props.book.goal,
  } as MiscUpdateParam);
  let newChanges = [...props.book.changes, change];
  newChanges = sortChanges(newChanges);
  const bookUpdates = {
    changes: newChanges,
    goal: newGoal,
  };
  await bookStore.setGoal(props.book.id, bookUpdates);
  modalStore.closeModal();
}

async function removeGoal(): Promise<void> {
  const change = newChange("removeGoal", props.book, {
    oldGoal: props.book.goal,
  } as MiscUpdateParam);
  let newChanges = [...props.book.changes, change];
  newChanges = sortChanges(newChanges);
  const bookUpdates = {
    changes: newChanges,
    goal: null,
  };
  await bookStore.setGoal(props.book.id, bookUpdates);
  modalStore.closeModal();
}
</script>

<style>
.update-goal {
  min-width: 290px;
}
.update-goal__input {
  margin: 0;
}
.update-goal__input-page {
  width: 50%;
  max-width: 325px;
}
</style>
