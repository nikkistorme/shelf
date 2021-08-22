<template>
  <div
    class="shelved-book"
    :class="{ expanded: book.expanded, edit: editVolumeInfo }"
  >
    <div class="img-container">
      <img
        :src="book.imageLinks.thumbnail"
        :alt="book.description"
        @click="expandCard"
        v-if="!editVolumeInfo"
      />
      <textarea
        type="text"
        v-model="book.imageLinks.thumbnail"
        v-if="editVolumeInfo"
        @change="changeImage"
      />
    </div>
    <div class="book-info">
      <h3 v-if="!editVolumeInfo" @click="logVolume()">{{ book.title }}</h3>
      <input type="text" v-if="editVolumeInfo" v-model="book.title" />
      <p v-if="!editVolumeInfo">By: {{ book.author }}</p>
      <div v-if="editVolumeInfo">
        <span>By:</span>
        <input type="text" v-model="book.author" />
      </div>
      <p v-if="!editVolumeInfo && !book.currentPage">
        {{ book.pageCount }} pages
      </p>
      <p v-if="!editVolumeInfo && book.currentPage">
        {{ book.currentPage }}/{{ book.pageCount }}p {{ percentRead }}
      </p>
      <div v-if="editVolumeInfo">
        <span>Page:</span>
        <input class="number-input" type="number" v-model="book.currentPage" />
        <span>/</span>
        <input class="number-input" type="number" v-model="book.pageCount" />
      </div>
      <p v-if="!editVolumeInfo && book.goalDate">
        Finish by {{ book.goalDate }}
      </p>
      <div v-if="editVolumeInfo">
        <span>Finish by:</span>
        <input type="date" v-model="book.goalDate" @change="test()" />
      </div>
      <p v-if="goalProgress">{{ goalProgress }}</p>
      <font-awesome-icon icon="edit" class="edit-icon" @click="editCard" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editVolumeInfo: false,
      bookCopy: JSON.parse(JSON.stringify(this.book)),
      imageHasChanged: false
    };
  },
  computed: {
    ...mapGetters(["userProfile", "currentShelf"]),
    goalProgress: function() {
      let progress = null;
      if (this.book.currentPage >= 0 && this.book.goalDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const goalDateObject = new Date(this.book.goalDate.replace(/-/g, "/"));
        const progressMilliseconds = Math.abs(goalDateObject - today);
        const progressDays = progressMilliseconds / (60 * 60 * 24 * 1000);
        const pagesPerDay = Math.round(
          (this.book.pageCount - this.book.goalToday.page) / progressDays
        );
        // use that number to calculate pagesPerDay, instead of currentPage
        // return pagesPerDay - (currentPage - newpagevalue)
        progress =
          pagesPerDay - (this.book.currentPage - this.book.goalToday.page);
      } else if (this.book.currentPage === this.book.pageCount) {
        return "You finished! Nice work!";
      } else if (!this.book.goalDate) {
        return null;
      }
      if (progress > 0) {
        return `Read ${progress}p today to stay on track to meet your goal`;
      } else if (progress <= 0) {
        return "You're on track to finish on time!";
      } else {
        return null;
      }
    },
    percentRead: function() {
      if (this.book.currentPage > 0) {
        return `(${Math.round(
          (this.book.currentPage / this.book.pageCount) * 100
        )}%)`;
      } else {
        return null;
      }
    }
  },
  methods: {
    expandCard() {
      this.book.expanded = !this.book.expanded;
    },
    changeImage() {
      if (!this.imageHasChanged) {
        this.imageHasChanged = true;
      }
    },
    editCard() {
      this.editVolumeInfo = !this.editVolumeInfo;
      if (!this.editVolumeInfo) {
        // this.book.pageCount = parseInt(this.book.pageCount);
        console.log("saving new book info");
        console.log("post edit book", this.book);
        console.log("pre edit book", this.bookCopy);
        this.$store.dispatch("updateShelves");
      } else {
        console.log("editing book info");
      }
    },
    test() {
      console.log("test");
      console.log(this.book.goalDate);
    },
    logVolume() {
      console.log(this.book);
    }
  }
};
</script>

<style lang="scss">
.shelved-book {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  height: 109px;
  width: 68px;
  padding: 5px;
  transition: all 0.3s ease;
  will-change: width, height;
  @media (min-width: 768px) {
    height: 205px;
    width: 128px;
    margin: 10px;
  }
  .book-info {
    width: 0;
    padding: 0;
    opacity: 0;
    white-space: nowrap;
    width: calc(258px - 58px);
    will-change: opacity;
    transition: all 0.3s ease;
    @media (min-width: 768px) {
      padding: 10px;
    }
  }
  .img-container {
    display: flex;
    width: 68px;
    flex-shrink: 0;
    @media (min-width: 768px) {
      width: 128px;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: scale-down;
    }
    textarea {
      height: 100%;
      width: 100%;
    }
  }
  &.expanded {
    width: 100%;
    height: 200px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    @media (min-width: 768px) {
      width: 485px;
      height: 205px;
    }
    .book-info {
      display: flex;
      opacity: 1;
      flex-direction: column;
      padding: 0 0 0 10px;
      @media (min-width: 768px) {
        width: calc(485px - 138px);
      }
    }
  }
  &.edit {
    .number-input {
      max-width: 75px;
    }
  }
}
.edit-icon {
  cursor: pointer;
}
</style>
