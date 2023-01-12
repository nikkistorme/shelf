<template>
  <div class="update-progress" :class="{ open: props.open }">
    <form class="update-progress__form p-1" @submit.prevent="updateProgress">
      <!-- END PAGE -->
      <p class="mb-1">I have now read</p>
      <div class="update-progress__page d-flex ai-center gap-1 mb-2">
        <InputNumber
          id="update-progress-end-at"
          v-model="endAt"
          :max="props.book.total_pages"
          class="update-progress__number mb-0"
        />
        <InputSegmentedControl
          v-model="progressType"
          :options="progressTypeOptions"
          class="w-100"
        />
      </div>
      <!-- END PAGE -->
      <!-- DURATION -->
      <InputCheckbox
        id="update-progress-duration-toggle"
        v-model="durationForm.logDuration"
        type="checkbox"
        label="Log duration"
        class="mb-2"
      />
      <div
        :class="{ 'open mb-1': durationForm.logDuration }"
        class="update-progress__duration-container h-0"
      >
        <InputSegmentedControl
          v-model="durationForm.durationType"
          :options="durationForm.durationOptions"
          class="mb-1"
        />
        <div
          class="update-progress__time"
          :class="{ open: durationForm.durationType === 'length' }"
        >
          <div class="update-progress__time-input d-grid">
            <InputNumber
              id="update-progress-duration"
              v-model="durationForm.duration"
              label="Read for"
              class="update-progress__number mb-0"
            />
            <p class="update-progress__text as-end">minutes</p>
          </div>
        </div>
        <div
          :class="{ open: durationForm.durationType === 'start-end' }"
          class="update-progress__duration-start-end"
        >
          <div class="d-flex ai-end mb-1">
            <InputDefault
              id="update-progress-duration-start"
              v-model="durationForm.durationStart"
              type="time"
              label="Start"
              class="update-progress__number mb-0 mr-1"
            />
            <ButtonStopwatch
              class="mr-1"
              @click="setDurationStartOrEnd('durationStart')"
            />
          </div>
          <div class="d-flex ai-end">
            <InputDefault
              id="update-progress-duration-end"
              v-model="durationForm.durationEnd"
              type="time"
              label="End"
              class="update-progress__number mb-0 mr-1"
            />
            <ButtonStopwatch
              class="mr-1"
              @click="setDurationStartOrEnd('durationEnd')"
            />
          </div>
        </div>
      </div>
      <!-- DURATION -->
      <div class="d-flex jc-between">
        <ButtonInline
          text="Finished?"
          color="green"
          underline
          @click="finishReadingBook"
        />
        <ButtonDefault
          type="submit"
          flavor="tiny"
          :disabled="updateProgressDisabled"
        >
          Update Progress
        </ButtonDefault>
      </div>
    </form>
  </div>
</template>

<script>
import { useBookStore } from "~/store/BookStore";
import {
  progressTypeOptions as progressServiceTypeOptions,
  durationForm as progressServiceDurationForm,
} from "~/services/progressService";
import {
  getTimeString,
  HhMmDifferenceInMinutes,
} from "~~/services/timeService.js";
import { getNewMinutesPerPage } from "~~/services/statsService";
import { newChange, sortChanges } from "~/services/changeService";
import { useModalStore } from "~~/store/ModalStore";

export default {
  props: {
    book: Object,
    open: Boolean,
  },
  setup(props) {
    const endAt = ref(props.book.current_page);
    const progressTypeOptions = ref(progressServiceTypeOptions);
    const progressType = ref("pages");

    const updateProgressDisabled = computed(() => {
      return endAt.value <= 0 || endAt.value > props.book.total_pages;
    });

    // Duration
    const durationForm = ref(progressServiceDurationForm);
    function setDurationStartOrEnd(type) {
      const nowTime = getTimeString(new Date());
      durationForm.value[type] = nowTime;
    }

    function convertPercentsToPages() {
      let finalEnd = endAt.value;
      if (progressType.value === "percent") {
        finalEnd = Math.round((finalEnd / 100) * props.book.total_pages);
      }
      return finalEnd;
    }

    function getFinalDuration() {
      const startEnd =
        durationForm.value.logDuration &&
        durationForm.value.durationType === "start-end";
      const length =
        durationForm.value.logDuration &&
        durationForm.value.durationType === "length";
      if (startEnd) {
        return HhMmDifferenceInMinutes(
          durationForm.value.durationStart,
          durationForm.value.durationEnd
        );
      } else if (length) {
        return durationForm.value.duration;
      } else {
        return null;
      }
    }

    const bookStore = useBookStore();
    const modalStore = useModalStore();
    async function updateProgress() {
      const finalEnd = convertPercentsToPages();
      const change = newChange("updateProgress", props.book, {
        endAt: finalEnd,
        duration: getFinalDuration(),
        oldGoal: props.book.goal,
      });
      let newChanges = [...props.book.changes, change];
      newChanges = sortChanges(newChanges);
      const bookUpdates = {
        changes: newChanges,
        current_page: finalEnd,
        minutes_per_page: getNewMinutesPerPage(newChanges),
      };
      await bookStore.updateProgress(props.book.id, bookUpdates);
      modalStore.closeModal();
    }

    async function finishReadingBook() {
      const finalEnd = props.book.total_pages;
      const change = newChange("finishReadingBook", props.book, {
        endAt: finalEnd,
        duration: getFinalDuration(),
        goal: props.book.goal,
      });
      let newChanges = [...props.book.changes, change];
      newChanges = sortChanges(newChanges);
      const bookUpdates = {
        changes: newChanges,
        minutes_per_page: getNewMinutesPerPage(newChanges),
        current_page: finalEnd,
        goal: null,
        status: "finished",
      };
      await bookStore.finishReadingBook(props.book.id, bookUpdates);
      modalStore.closeModal();
    }

    return {
      props,
      endAt,
      progressType,
      progressTypeOptions,
      durationForm,
      setDurationStartOrEnd,
      updateProgressDisabled,
      updateProgress,
      finishReadingBook,
    };
  },
};
</script>

<style>
.update-progress.open {
  visibility: visible;
  height: auto;
  min-width: 350px;
  width: auto;
  max-width: 450px;
}
.update-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  visibility: hidden;
  height: 0px;
  width: 0px;
  transform: translate(-50%, -50%);
  padding: var(--spacing-size-2) var(--spacing-size-2) var(--spacing-size-2)
    var(--spacing-size-2);
  background-color: white;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-1);
  z-index: var(--z-index-modal);
  overflow: auto;
  scroll-behavior: smooth;
}
.update-progress__page {
  grid-template-columns: repeat(2, min-content);
}
.update-progress__time,
.update-progress__duration-start-end {
  position: absolute;
  width: 100%;
  max-width: 325px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}
.update-progress__time.open,
.update-progress__duration-start-end.open {
  visibility: visible;
  opacity: 1;
}
.update-progress__time-input {
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-size-1);
}
.update-progress__text {
  height: min-content;
  margin-bottom: calc(var(--spacing-size-1) - 5px);
}
.update-progress__duration-container {
  position: relative;
  overflow: hidden;
}
.update-progress__duration-container.open {
  height: 250px;
}
</style>
