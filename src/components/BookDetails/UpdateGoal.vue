<template>
  <div class="update-goal" :class="{ open: updateGoalOpen }">
    <form class="update-goal__form" @submit.prevent="updateGoal">
      <DefaultInput
        id="goal-target-page"
        v-model="targetPage"
        label="Target Page"
        type="number"
        class="update-goal__input-page"
        :max="detailedBook.totalPages"
      />
      <DefaultInput
        id="goal-date"
        v-model="goalDate"
        label="Target Date"
        class="update-goal__input mb-1"
        type="date"
      />
      <div class="d-flex jc-space-around mb-1">
        <InlineButton
          text="2 weeks"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToTwoWeeks"
        />
        <InlineButton
          text="1 month"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToOneMonth"
        />
        <InlineButton
          text="2 months"
          class="update-goal__button"
          underline
          color="blue"
          @click="setGoalToTwoMonth"
        />
      </div>
      <div class="d-flex jc-end">
        <DefaultButton
          :disabled="disableUpdateGoal()"
          type="submit"
          text="Set Goal"
          flavor="tiny"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";

import changeService from "../../services/changeService";

import DefaultInput from "../forms/DefaultInput.vue";
import DefaultButton from "../buttons/DefaultButton.vue";
import InlineButton from "../buttons/InlineButton.vue";

const setDate = (timestamp = null) => {
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

export default {
  components: {
    DefaultInput,
    DefaultButton,
    InlineButton,
  },
  data() {
    return {
      goalDate: setDate(),
      targetPage: this.$store.getters.detailedBook.totalPages,
      oldGoal: this.$store.getters.detailedBook.goal,
    };
  },
  computed: {
    ...mapGetters(["updateGoalOpen", "detailedBook"]),
    goalDateTimestamp() {
      const goalDate = this.goalDate;
      let goalDateObject = new Date(goalDate);
      goalDateObject.setDate(goalDateObject.getDate() + 1);
      return Math.floor(goalDateObject.getTime());
    },
    form() {
      return {
        targetPage: parseInt(this.targetPage),
        goalDate: this.goalDateTimestamp,
      };
    },
  },
  watch: {
    updateGoalOpen(newValue) {
      if (newValue) {
        document.querySelector(".update-goal").style.height =
          document.querySelector(".update-goal__form").scrollHeight + "px";
      } else {
        document.querySelector(".update-goal").style.height = "0px";
      }
    },
  },
  methods: {
    ...mapMutations(["toggleUpdateGoal"]),
    ...mapActions(["setGoal"]),
    test() {
      console.log(this.disableUpdateGoal());
    },
    disableUpdateGoal() {
      return (
        this.targetPage < this.detailedBook.readPages ||
        new Date(this.goalDate) < new Date(setDate())
      );
    },
    async updateGoal() {
      let newChange = changeService.makeChangeFromForm(
        "setGoal",
        this.form,
        this.oldGoal
      );
      await this.setGoal({
        book: this.detailedBook,
        change: newChange,
      });
      this.toggleUpdateGoal();
    },
    setGoalToTwoWeeks() {
      this.test();
      this.goalDate = setDate(Date.now() + 12096e5);
      this.test();
    },
    setGoalToOneMonth() {
      this.goalDate = setDate(Date.now() + 2628e6);
    },
    setGoalToTwoMonth() {
      this.goalDate = setDate(Date.now() + 5256e6);
    },
  },
};
</script>

<style>
.update-goal {
  height: 0;
  overflow: hidden;
  transition: height 0.4s ease;
}
.update-goal__form {
  padding: var(--spacing-size-1) var(--spacing-size-2);
}
.update-goal__input {
  margin: 0;
}
.update-goal__input-page {
  width: 50%;
  max-width: 325px;
}
</style>
