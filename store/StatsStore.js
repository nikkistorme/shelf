import { defineStore } from "pinia";
import { getPagesThisWeek } from "~/services/statsService";

export const useStatsStore = defineStore("StatsStore", {
  state: () => ({
    loading: false,
    pagesToday: 0,
    pagesThisWeek: 0,
  }),
  actions: {
    async getRecentPageData() {
      this.loading = true;
      let pagesToday = 0;
      let pagesThisWeek = 0;
      try {
        [pagesToday, pagesThisWeek] = await getPagesThisWeek();
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.pagesToday = pagesToday;
      this.pagesThisWeek = pagesThisWeek;
      this.loading = false;
    },
  },
});
