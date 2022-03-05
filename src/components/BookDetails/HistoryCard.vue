<template>
  <div class="history-card card w-100">
    <h4>History</h4>
    <ul>
      <li
        v-for="(change, i) in displayItems"
        :key="i"
        class="history-card__date-item d-flex flex-column"
        :class="{ open: change.open }"
      >
        <div class="d-flex flex-column">
          <div class="d-flex al-start" :class="{}">
            <HistoryCollapsedIcon
              class="history-card__collapsed-icon mr-1"
              @click="expandDate(change)"
            />
            <div>
              <p class="history-card__date" @click="expandDate(change)">
                <span>{{ change.label }}</span>
                <span>({{ pagesReadInGroupedUpdate(change) }}p)</span>
              </p>
              <ul
                class="history-card__times"
                :class="`label-${i}`"
                :style="[
                  change.open ? { height: updateTimesScrollHeight(i) } : {},
                ]"
              >
                <li
                  v-for="(update, j) in groupedUpdates[change.label]"
                  :key="j"
                  class="history-card__time d-flex al-center"
                >
                  <div class="d-flex al-center">
                    <p>
                      <span>{{ timeFromStamp(update.payload.timestamp) }}</span>
                      <span> ~ </span>
                      <span>{{ historyMessage(update) }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import statsService from "../../services/statsService";
import HistoryCollapsedIcon from "./HistoryCollapsedIcon.vue";

const getGroupedUpdates = (changes) => {
  return statsService.groupUpdatesByDate(changes);
};

const getGroupedUpdateLabels = (changes) => {
  let labels = Object.keys(getGroupedUpdates(changes)).filter(
    (key) => !key.includes("NaN")
  );
  labels.sort((a, b) => {
    return new Date(b) - new Date(a);
  });
  labels = labels.map((label) => {
    return {
      label,
      open: false,
    };
  });
  return labels;
};

export default {
  components: { HistoryCollapsedIcon },
  data() {
    return {
      displayItems: [],
    };
  },
  computed: {
    ...mapGetters(["detailedBook"]),
    detailedBookWatcher() {
      return this.detailedBook;
    },
    groupedUpdates() {
      const groupedUpdates = getGroupedUpdates(this.detailedBook.changes);
      return groupedUpdates;
    },
    groupedUpdateLabels() {
      const groupedUpdateLabels = getGroupedUpdateLabels(
        this.detailedBook.changes
      );
      return groupedUpdateLabels;
    },
  },
  created() {
    this.displayItems = this.groupedUpdateLabels;
  },
  methods: {
    expandDate(change) {
      change.open = !change.open;
    },
    timeFromStamp(timestamp) {
      const dateAndTime = new Date(timestamp);
      const hours = `${
        dateAndTime.getHours() > 12
          ? dateAndTime.getHours() - 12
          : dateAndTime.getHours()
      }`;
      const minutes = `${dateAndTime.getMinutes()}${
        dateAndTime.getMinutes() < 10 ? "0" : ""
      }`;
      const period = `${dateAndTime.getHours() >= 12 ? "pm" : "am"}`;
      return `${hours}:${minutes}${period}`;
    },
    historyMessage(update) {
      let duration = "";
      switch (update.action) {
        case "updatePage":
          if (update.payload.duration > 0) {
            duration = ` in ${update.payload.duration}m`;
          }
          return `Page ${update.payload.oldValue}-${update.payload.newValue}${duration}`;
        default:
          return "Updated";
      }
    },
    updateTimesScrollHeight(label) {
      return (
        document.querySelector(`.history-card__times.label-${label}`)
          .scrollHeight + "px"
      );
    },
    pagesReadInGroupedUpdate(change) {
      const targetDayUpdates = this.groupedUpdates[change.label];
      const lastPage = targetDayUpdates[0].payload.newValue;
      const earliestPage =
        targetDayUpdates[targetDayUpdates.length - 1].payload.oldValue;
      return lastPage - earliestPage;
    },
  },
};
</script>

<style>
.history-card__date-item {
  margin-bottom: calc(var(--spacing-size-1) / 2);
}
.history-card__collapsed-icon {
  margin-top: 4px;
  transition: transform 0.3s ease;
  cursor: pointer;
}
.history-card__date-item.open .history-card__collapsed-icon {
  transform: rotate(90deg);
}
.history-card__date {
  cursor: pointer;
}
.history-card__times {
  height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}
</style>
