<template>
  <div class="update-progress h-0" :class="{ open: updateProgressOpen }">
    <form class="update-progress__form p-1" @submit.prevent="updateProgress">
      <!-- START PAGE -->
      <div class="update-progress__page d-grid gap-1 mb-1">
        <NumberInput
          id="update-progress-start-at"
          v-model="startAt"
          label="Start page"
          :max="detailedBook.totalPages"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-start-type"
          v-model="startType"
          class="update-progress__type as-end"
          :options="progressTypeOptions"
        />
      </div>
      <!-- START PAGE -->
      <!-- END PAGE -->
      <div class="update-progress__page d-grid gap-1 mb-2">
        <NumberInput
          id="update-progress-end-at"
          v-model="endAt"
          label="End page"
          :max="detailedBook.totalPages"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-end-type"
          v-model="endType"
          class="update-progress__type as-end"
          :options="progressTypeOptions"
        />
      </div>
      <!-- END PAGE -->
      <!-- DURATION -->
      <CheckboxInput
        id="update-progress-duration-toggle"
        v-model="logDuration"
        type="checkbox"
        label="Log duration"
        class="mb-2"
      />
      <div
        :class="{ 'open mb-1': logDuration }"
        class="update-progress__duration-container h-0"
      >
        <SegmentedControlInput
          v-model="durationType"
          :options="durationOptions"
          class="mb-1"
        />
        <div
          class="update-progress__time"
          :class="{ open: durationType === 'length' }"
        >
          <div class="update-progress__time-input d-grid">
            <NumberInput
              id="update-progress-duration"
              v-model="duration"
              label="Read for"
              class="update-progress__number mb-0"
            />
            <p class="update-progress__text as-end">minutes</p>
          </div>
        </div>
        <div
          :class="{ open: durationType === 'start-end' }"
          class="update-progress__duration-start-end"
        >
          <div class="d-flex ai-end mb-1">
            <DefaultInput
              id="update-progress-duration-start"
              v-model="durationStart"
              type="time"
              label="Start"
              class="update-progress__number mb-0 mr-1"
            />
            <IconButton
              class="mr-1"
              :color="blue"
              @click="setDurationStartOrEnd('durationStart')"
            />
          </div>
          <div class="d-flex ai-end">
            <DefaultInput
              id="update-progress-duration-end"
              v-model="durationEnd"
              type="time"
              label="End"
              class="update-progress__number mb-0 mr-1"
            />
            <IconButton
              class="mr-1"
              :color="blue"
              @click="setDurationStartOrEnd('durationEnd')"
            />
          </div>
        </div>
      </div>
      <div class="d-flex jc-space-between">
        <InlineButton
          text="Finished?"
          color="green"
          underline
          @click="finish"
        />
        <DefaultButton
          type="submit"
          text="Update"
          flavor="tiny"
          :disabled="updateProgressDisabled"
        />
      </div>
      <!-- DURATION -->
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import changeService from "../../services/changeService.js";
import progressService from "../../services/progressService.js";
import {
  HhMmDifferenceInMinutes,
  getTimeString,
} from "../../services/dateTimeService.js";

import DefaultInput from "../forms/DefaultInput.vue";
import CheckboxInput from "../forms/CheckboxInput.vue";
import InlineButton from "../buttons/InlineButton.vue";
import SelectInput from "../forms/SelectInput.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import SegmentedControlInput from "../forms/SegmentedControlInput.vue";
import IconButton from "../buttons/IconButton.vue";
import NumberInput from "../forms/NumberInput.vue";

export default {
  components: {
    DefaultInput,
    CheckboxInput,
    InlineButton,
    SelectInput,
    DefaultButton,
    SegmentedControlInput,
    IconButton,
    NumberInput,
  },
  data() {
    return {
      progressTypeOptions: progressService.progressTypeOptions,
      startAt: this.$store.getters.detailedBook.readPages,
      endAt: this.$store.getters.detailedBook.readPages,
      oldFinishedDate: this.$store.getters.detailedBook.finishedDate,
      startType: "pages",
      endType: "pages",
      ...progressService.durationForm,
    };
  },
  computed: {
    ...mapGetters(["detailedBook", "updateProgressOpen"]),
    form() {
      return {
        startAt: parseInt(this.startAt),
        startType: this.startType,
        endAt: parseInt(this.endAt),
        endType: this.endType,
        duration: parseInt(this.duration),
      };
    },
    updateProgressDisabled() {
      return (
        this.startAt >= this.endAt ||
        this.startAt > this.detailedBook.totalPages ||
        this.endAt > this.detailedBook.totalPages
      );
    },
  },
  watch: {
    startType(newValue) {
      this.startAt = progressService.setProgressAfterTypeSwap(
        newValue,
        this.startAt,
        this.detailedBook.totalPages
      );
    },
    endType(newValue) {
      this.endAt = progressService.setProgressAfterTypeSwap(
        newValue,
        this.endAt,
        this.detailedBook.totalPages
      );
    },
    updateProgressOpen(newValue) {
      if (newValue) {
        document.querySelector(".update-progress").style.height =
          document.querySelector(".update-progress__form").scrollHeight + "px";
      } else {
        document.querySelector(".update-progress").style.height = "0px";
      }
    },
    durationType(newValue) {
      if (newValue) {
        setTimeout(() => {
          document.querySelector(".update-progress").style.height =
            document.querySelector(".update-progress__form").scrollHeight +
            "px";
        }, 300);
      }
    },
    logDuration() {
      setTimeout(() => {
        document.querySelector(".update-progress").style.height =
          document.querySelector(".update-progress__form").scrollHeight + "px";
      }, 1);
    },
  },
  methods: {
    ...mapActions(["updatePage", "finishReading"]),
    setDurationStartOrEnd(type) {
      const nowTime = getTimeString(new Date());
      this[type] = nowTime;
    },
    convertPercentsToPages() {
      if (this.startType === "percent") {
        this.startAt = Math.round(
          (this.startAt / 100) * this.detailedBook.totalPages
        );
      }
      if (this.endType === "percent") {
        this.endAt = Math.round(
          (this.endAt / 100) * this.detailedBook.totalPages
        );
      }
    },
    async updateProgress() {
      this.convertPercentsToPages();
      if (this.durationType === "start-end") {
        this.duration = HhMmDifferenceInMinutes(
          this.durationStart,
          this.durationEnd
        );
      }
      console.log("🚀 ~ this.duration", this.duration);
      console.log("🚀 ~ this.form.duration", this.form.duration);
      console.log("🚀 ~ this.form", this.form);
      await this.updatePage({
        book: this.detailedBook,
        change: changeService.makeChangeFromForm("updatePage", this.form),
      });
      this.resetForm();
    },
    async finish() {
      this.endAt = this.detailedBook.totalPages;
      await this.finishReading({
        book: this.detailedBook,
        change: changeService.makeChangeFromForm(
          "finishReading",
          this.form,
          this.oldFinishedDate
        ),
      });
    },
    resetForm() {
      this.startAt = this.detailedBook.readPages;
      this.startType = "pages";
      this.endAt = this.detailedBook.readPages;
      this.endType = "pages";
      this.duration = 0;
    },
  },
};
</script>

<style>
.update-progress {
  overflow: hidden;
  transition: height 0.4s ease;
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
  transition: all 0.3s 0.2s ease;
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
