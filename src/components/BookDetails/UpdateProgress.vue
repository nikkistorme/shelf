<template>
  <div class="update-progress" :class="{ open: updateProgressOpen }">
    <form class="update-progress__form" @submit.prevent="updateProgress">
      <div class="update-progress__page d-grid mb-1">
        <DefaultInput
          id="update-progress-start-at"
          v-model="startAt"
          label="Started at"
          type="number"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-start-type"
          v-model="startType"
          class="update-progress__type"
          :options="progressTypeOptions"
        />
      </div>
      <div class="update-progress__page d-grid mb-1">
        <DefaultInput
          id="update-progress-end-at"
          v-model="endAt"
          label="Ended at"
          type="number"
          class="update-progress__number mb-0"
        />
        <SelectInput
          id="update-progress-end-type"
          v-model="endType"
          class="update-progress__type"
          :options="progressTypeOptions"
        />
      </div>
      <hr />
      <div class="update-progress__time d-grid">
        <DefaultInput
          id="update-progress-duration"
          v-model="duration"
          type="number"
          label="Read for"
          class="update-progress__number mb-0"
        />
        <p class="update-progress__text">minutes (optional)</p>
      </div>
      <div class="mt-1 d-flex jc-space-between">
        <InlineButton
          text="Finished?"
          color="green"
          underline
          @click="finish"
        />
        <DefaultButton type="submit" text="Update" flavor="tiny" />
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
import InlineButton from "../buttons/InlineButton.vue";
import SelectInput from "../forms/SelectInput.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
export default {
  components: { DefaultInput, InlineButton, SelectInput, DefaultButton },
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
      oldFinishedDate: this.$store.getters.detailedBook.finishedDate,
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
  },
  methods: {
    ...mapMutations(["toggleUpdateProgress"]),
    ...mapActions(["updatePage", "finishReading"]),
    test() {
      console.log(this.$store.getters.detailedBook.readPages);
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
      console.log("🚀 ~ newChange", newChange);
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
.update-progress__time {
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-size-1);
  max-width: 325px;
}
.update-progress__text {
  align-self: end;
  height: min-content;
  margin-bottom: calc(var(--spacing-size-1) - 5px);
}
</style>
