<template>
  <div>
    <div class="drawer" :class="{ open: drawer.open }">
      <div @click="close" class="close_drawer_button">
        <font-awesome-icon icon="times" />
      </div>
      <div v-if="drawer.content" class="inspect_book">
        <div class="top">
          <div v-if="drawer.content.imageLinks" class="drawer_img">
            <img
              :src="drawer.content.imageLinks.thumbnail"
              :alt="drawer.content.title"
            />
          </div>
          <div class="top_level_info">
            <div class="title">
              <h3>{{ drawer.content.title }}</h3>
            </div>
            <p>{{ drawer.content.author }}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="pages">
            <p>
              {{ drawer.content.currentPage }}/{{ drawer.content.pageCount }}p
              {{ percentRead(drawer.content) }}
            </p>
          </div>
          <p v-if="drawer.content.goalDate">
            🗓 {{ drawer.content.goalDate }}
            <span v-if="goalProgress(drawer.content)">
              ({{ goalProgress(drawer.content) }})
            </span>
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
            <button
              v-if="editMode"
              class="finish_book_button"
              @click="finishBook"
            >
              Finished!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="drawer-overlay"
      :class="{ open_drawer: drawer.open }"
      @click="close"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      editMode: false,
      newPage: -1
    };
  },
  computed: {
    ...mapGetters(["drawer"])
  },
  methods: {
    ...mapMutations(["closeDrawer"]),
    close() {
      this.$store.commit("closeDrawer");
    },
    percentRead(book) {
      if (book.currentPage > 0) {
        return `(${Math.round((book.currentPage / book.pageCount) * 100)}%)`;
      } else {
        return null;
      }
    },
    goalProgress(book) {
      let progress = null;
      console.log("book", book);
      if (book.currentPage >= 0 && book.goalDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const goalDateObject = new Date(book.goalDate.replace(/-/g, "/"));
        const progressMilliseconds = Math.abs(goalDateObject - today);
        const progressDays = progressMilliseconds / (60 * 60 * 24 * 1000);
        const pagesPerDay = Math.round(
          (book.pageCount - book.goalToday.page) / progressDays
        );
        // use that number to calculate pagesPerDay
        // return pagesPerDay - (currentPage - newpagevalue)
        progress = pagesPerDay - (book.currentPage - book.goalToday.page);
      } else if (book.currentPage === book.pageCount) {
        return "Finished!";
      } else if (!book.goalDate) {
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
    updatePage() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        console.log("saving new book info");
        this.drawer.content.currentPage = this.newPage;
        this.$store.dispatch("updatePage", this.drawer.content);
      } else {
        console.log("editing book info");
        this.newPage = this.drawer.content.currentPage;
      }
    },
    finishBook() {
      this.editMode = false;
      this.$store.dispatch("markAsRead", this.drawer.content);
    }
  }
};
</script>

<style lang="scss">
.drawer {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 10; /* Stay on top */
  top: 0; /* Stay at the top */
  left: -3px;
  background-color: #fff;
  overflow-x: hidden;
  transition: width 0.5s;
  border-right: black solid 3px;
}
.close_drawer_button {
  position: absolute;
  right: 5px;
  top: 1px;
  cursor: pointer;
  font-size: 25px;
}
.open_drawer {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
.inspect_book {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  .top {
    display: flex;
  }
  .top_level_info {
    opacity: 0;
    transition: opacity 0.25s;
    transition-delay: 0.5s;
    margin-left: 1rem;
  }
}
.open {
  transition: all 0.5s;
  width: 300px;
  .top_level_info {
    opacity: 1;
  }
}
.drawer_img {
  position: relative;
  height: 150px;
  min-width: 100px;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: top;
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
