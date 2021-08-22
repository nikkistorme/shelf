<template>
  <div class="in-progress-book">
    <div class="img-container">
      <img
        :src="volume.imageLinks.thumbnail"
        :alt="`${volume.title} by ${volume.author}`"
      />
    </div>
    <div class="book-info">
      <h3 @click="logVolume()">{{ volume.title }}</h3>
      <p>by {{ volume.author }}</p>
      <div class="pages">
        <p>
          {{ volume.currentPage }}/{{ volume.pageCount }}p
          {{ percentRead(volume) }}
        </p>
      </div>
      <p v-if="volume.goalDate">
        🗓 {{ volume.goalDate }}
        <span v-if="goalProgress(volume)">({{ goalProgress(volume) }})</span>
      </p>
      <div class="update-page">
        <button class="update-page-button" @click="updatePage">
          <font-awesome-icon icon="bookmark" class="bookmark-icon" />
        </button>
        <input
          class="update-page-input"
          v-if="editMode"
          type="number"
          v-model="newPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    volume: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      newPage: -1
    };
  },
  computed: {
    ...mapGetters(["userProfile", "currentUser"])
  },
  methods: {
    goalProgress(volume) {
      let progress = null;
      if (volume.currentPage >= 0 && volume.goalDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const goalDateObject = new Date(volume.goalDate.replace(/-/g, "/"));
        const progressMilliseconds = Math.abs(goalDateObject - today);
        const progressDays = progressMilliseconds / (60 * 60 * 24 * 1000);
        const pagesPerDay = Math.round(
          (volume.pageCount - volume.goalToday.page) / progressDays
        );
        // use that number to calculate pagesPerDay, instead of currentPage
        // return pagesPerDay - (currentPage - newpagevalue)
        progress = pagesPerDay - (volume.currentPage - volume.goalToday.page);
      } else if (volume.currentPage === volume.pageCount) {
        return "Finished!";
      } else if (!volume.goalDate) {
        return null;
      }
      if (progress > 0) {
        return `${progress}p left today`;
      } else if (progress <= 0) {
        return "✔️";
      } else {
        return null;
      }
    },
    percentRead(volume) {
      if (volume.currentPage > 0) {
        return `(${Math.round(
          (volume.currentPage / volume.pageCount) * 100
        )}%)`;
      } else {
        return null;
      }
    },
    updatePage() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        console.log("saving new book info");
        this.volume.currentPage = this.newPage;
        this.$store.dispatch("updatePage", this.volume);
      } else {
        console.log("editing book info");
        this.newPage = this.volume.currentPage;
      }
    },
    logVolume() {
      console.log(this.volume);
    }
  }
};
</script>

<style lang="scss">
.in-progress-book {
  display: flex;
  margin: 20px 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.img-container {
  display: flex;
  margin-right: 15px;
  img {
    height: 100%;
    width: 100%;
    width: 65px;
    object-fit: scale-down;
    object-position: top left;
  }
  textarea {
    height: 100%;
    width: 100%;
  }
}
.book-info {
  flex: 1;
  .pages {
    display: flex;
    margin: 3px 0;
  }
}
.update-page {
  display: flex;
  margin-top: 5px;
  &-button {
    height: 30px;
    border: none;
    padding: 0;
    font-size: 18px;
    outline: none;
    background: none;
  }
  &-input {
    max-width: 75px;
    margin-left: 5px;
  }
}
</style>
