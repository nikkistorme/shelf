import { defineStore } from "pinia";
import { getPagesThisWeek } from "~/services/statsService";

type StatsState = {
  loading: boolean
  pagesToday: number
  pagesThisWeek: number
}

export const useStatsStore = defineStore("StatsStore", {
  state: (): StatsState => ({
    loading: false,
    pagesToday: 0,
    pagesThisWeek: 0,
  }),
  actions: {
    async getRecentPageData(): Promise<void> {
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
