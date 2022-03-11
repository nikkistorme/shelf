<template>
  <div class="update-progress" :class="{ open: updateProgressOpen }">
    <form class="update-progress__form" @submit.prevent="updateProgress">
      <div class="update-progress__page d-grid mb-1">
        <DefaultInput
          id="update-progress-start-at"
          v-model="startAt"
          label="Start page"
          type="number"
          :max="detailedBook.totalPages"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-start-type"
          v-model="startType"
          class="update-progress__type"
          :options="progressTypeOptions"
        />
      </div>
      <div class="update-progress__page d-grid mb-2">
        <DefaultInput
          id="update-progress-end-at"
          v-model="endAt"
          label="End page"
          type="number"
          :max="detailedBook.totalPages"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-end-type"
          v-model="endType"
          class="update-progress__type"
          :options="progressTypeOptions"
        />
      </div>
      <CheckboxInput
        id="update-progress-duration-toggle"
        v-model="logDuration"
        type="checkbox"
        label="Log duration"
        class="mb-2"
      />
      <div
        :class="{ 'open mb-1': logDuration }"
        class="update-progress__duration-container"
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
          <!-- <div class="update-progress__time-input d-grid mb-1">
            <DefaultInput
              id="update-progress-duration"
              v-model="duration"
              type="number"
              label="Read for"
              class="update-progress__number mb-0"
            />
            <p class="update-progress__text">hours</p>
          </div> -->
          <div class="update-progress__time-input d-grid">
            <DefaultInput
              id="update-progress-duration"
              v-model="duration"
              label="Read for"
              type="number"
              class="update-progress__number mb-0"
            />
            <p class="update-progress__text">minutes</p>
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
              @click="setDurationStartOrEnd('start')"
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
              @click="setDurationStartOrEnd('end')"
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
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import changeService from "../../services/changeService.js";

import DefaultInput from "../forms/DefaultInput.vue";
import CheckboxInput from "../forms/CheckboxInput.vue";
import InlineButton from "../buttons/InlineButton.vue";
import SelectInput from "../forms/SelectInput.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import SegmentedControlInput from "../forms/SegmentedControlInput.vue";
import IconButton from "../buttons/IconButton.vue";

export default {
  components: {
    DefaultInput,
    CheckboxInput,
    InlineButton,
    SelectInput,
    DefaultButton,
    SegmentedControlInput,
    IconButton,
  },
  data() {
    return {
      progressTypeOptions: [
        {
          label: "pages",
          value: "pages",
        },
        {
          label: "%",
          value: "percent",
        },
      ],
      startAt: this.$store.getters.detailedBook.readPages,
      startType: "pages",
      endAt: this.$store.getters.detailedBook.readPages,
      endType: "pages",
      duration: 0,
      logDuration: false,
      durationType: "start-end",
      durationStart: 0,
      durationEnd: 0,
      oldFinishedDate: this.$store.getters.detailedBook.finishedDate,
      durationOptions: [
        {
          label: "Start-End",
          value: "start-end",
        },
        {
          label: "Length",
          value: "length",
        },
      ],
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
      if (newValue === "percent") {
        const percent = Math.round(
          (this.startAt / this.detailedBook.totalPages) * 100
        );
        this.startAt = percent;
      } else if (newValue === "pages") {
        this.startAt = Math.round(
          (this.startAt / 100) * this.detailedBook.totalPages
        );
      }
    },
    endType(newValue) {
      if (newValue === "percent") {
        const percent = Math.round(
          (this.endAt / this.detailedBook.totalPages) * 100
        );
        this.endAt = percent;
      } else if (newValue === "pages") {
        this.endAt = Math.round(
          (this.endAt / 100) * this.detailedBook.totalPages
        );
      }
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
    ...mapMutations(["toggleUpdateProgress"]),
    ...mapActions(["updatePage", "finishReading"]),
    test() {
      console.log(this.$store.getters.detailedBook.readPages);
    },
    setDurationStartOrEnd(type) {
      const now = new Date();
      if (type === "start") {
        this.durationStart = `${now.getHours()}:${now.getMinutes()}`;
      } else if (type === "end") {
        this.durationEnd = `${now.getHours()}:${now.getMinutes()}`;
      }
    },
    formatTime(timestamp) {
      const dateAndTime = new Date(timestamp);
      const hours = `${
        dateAndTime.getHours() > 12
          ? dateAndTime.getHours() - 12
          : dateAndTime.getHours()
      }`;
      const minutes = `${
        dateAndTime.getMinutes() < 10 ? "0" : ""
      }${dateAndTime.getMinutes()}`;
      const period = `${dateAndTime.getHours() >= 12 ? "pm" : "am"}`;
      return `${hours}:${minutes}${period}`;
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
      if (this.updateProgressOpen) {
        this.convertPercentsToPages();
        if (this.durationType === "start-end") {
          this.duration = Math.round(
            (this.durationEnd - this.durationStart) / 60000
          );
        }
        let newChange = changeService.makeChangeFromForm(
          "updatePage",
          this.form
        );
        await this.updatePage({
          book: this.detailedBook,
          change: newChange,
        });
        this.toggleUpdateProgress();
        this.resetForm();
      }
    },
    async finish() {
      this.toggleUpdateProgress();
      this.endAt = this.detailedBook.totalPages;
      let newChange = changeService.makeChangeFromForm(
        "finishReading",
        this.form,
        this.oldFinishedDate
      );
      await this.finishReading({
        book: this.detailedBook,
        change: newChange,
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
  height: 0;
  overflow: hidden;
  transition: height 0.4s ease;
}
.update-progress__form {
  padding: var(--spacing-size-1) var(--spacing-size-2);
}
.update-progress__page {
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-size-1);
  max-width: 325px;
}
.update-progress__type {
  align-self: end;
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
  align-self: end;
  height: min-content;
  margin-bottom: calc(var(--spacing-size-1) - 5px);
}
.update-progress__duration-container {
  position: relative;
  height: 0;
  overflow: hidden;
}
.update-progress__duration-container.open {
  height: 250px;
}
</style>
