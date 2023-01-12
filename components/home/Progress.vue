<template>
  <div class="home-progress d-flex flex-column ai-center gap-half">
    <!-- <IconGoals /> -->
    <ul class="home-progress__list w-100 d-flex flex-column ai-start gap-1">
      <li class="home-progress__list-item d-flex jc-between w-100">
        <h2 class="fw-1">Pages read today</h2>
        <div class="home-progress__list-value">
          <p class="fs-2">{{ pagesToday }}</p>
        </div>
      </li>
      <li class="home-progress__list-item d-flex jc-between w-100">
        <h2 class="fw-1">Pages read this week</h2>
        <div class="home-progress__list-value">
          <p class="fs-2">{{ pagesThisWeek }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStatsStore } from "~/store/StatsStore";

export default {
  setup() {
    const statsStore = useStatsStore();
    const { pagesToday, pagesThisWeek } = storeToRefs(statsStore);

    onMounted(async () => {
      await statsStore.getRecentPageData();
    });

    return {
      pagesToday,
      pagesThisWeek,
    };
  },
};
</script>

<style scoped>
.home-progress__list-item {
  position: relative;
  padding: var(--spacing-size-1);
  border: var(--border-1);
  border-radius: var(--border-radius-1);
}
.home-progress__list-value {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
  background-color: var(--color-primary);
}
.home-progress__list-value * {
  color: var(--color-white);
}
</style>
