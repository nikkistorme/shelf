<template>
  <div class="inspect_book_container">
    <button class="edit_icon">
      <font-awesome-icon icon="edit" v-if="!editMode" @click="editBook" />
    </button>
    <div class="inspect_book" v-if="!editMode">
      <div class="drawer_img" @click="test">
        <img :src="book.image" :alt="book.title" />
      </div>
      <h2>{{ book.title }}</h2>
      <h3>{{ book.author }}</h3>
      <p>{{ book.totalPages }} pages</p>
      <Multiselect
        v-model="selectedShelves"
        :options="shelves"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :searchable="false"
        placeholder="Shelves"
        label="name"
        track-by="id"
      />
      <div class="inspect_book_row progress_row" v-if="book.inProgress">
        <div class="tracker">
          <ProgressCircle :percent="percentComplete" />
          <p v-if="!updateProgressMode">
            {{ book.readPages }} / {{ book.totalPages }}
          </p>
          <form
            class="update_progress_input"
            v-if="updateProgressMode"
            v-on:submit.prevent="updateProgress(book)"
          >
            <p>From page</p>
            <input
              v-model="startingPage"
              class="input"
              type="number"
              pattern="\d*"
              :max="book.totalPages"
            />
            <p>to</p>
            <input
              v-model="newPage"
              class="input"
              type="number"
              pattern="\d*"
              :max="book.totalPages"
            />
            <p>in</p>
            <input
              v-model="sessionDuration"
              class="input"
              type="number"
              pattern="\d*"
            />
            <p>minutes</p>
            <div class="update_progress_buttons" v-if="updateProgressMode">
              <button
                type="submit"
                class="black_button"
                :disabled="newPage < startingPage"
              >
                Update
              </button>
              <button class="green_button" @click="finishBook(book)">
                Finish
              </button>
            </div>
          </form>
        </div>
        <button
          class="black_button"
          @click="startUpdateProgressMode()"
          v-if="!updateProgressMode"
        >
          Update Progress
        </button>
      </div>
      <div class="inspect_book_row" v-if="remainingTime()">
        <p>At this rate, you'll finish in {{ remainingTime() }}</p>
      </div>
      <div class="inspect_book_row finished_row" v-if="book.finished">
        <font-awesome-icon icon="check-circle" class="finished_icon" />
        <p>Finished on {{ dateFinished }}</p>
      </div>
      <div
        class="inspect_book_row"
        v-if="!book.inProgress || book.changes.length"
      >
        <button
          class="black_button"
          @click="startReading"
          v-if="!book.inProgress"
        >
          {{ book.finished ? "Read Again" : "Start Reading" }}
        </button>
        <ul v-if="book.changes.length">
          <li v-for="(change, i) in book.changes" :key="i">
            <p>{{ historyMessage(change) }}</p>
          </li>
        </ul>
      </div>
      <div class="inspect_book_row">
        <button class="red_button" @click="deleteBook(book)">
          Remove Book
        </button>
      </div>
    </div>
    <form
      class="edit_book"
      v-if="editMode"
      v-on:submit.prevent="updateBook(book)"
    >
      <textarea
        class="input image_input"
        name="image-url"
        v-model="book.image"
        v-if="editMode"
        placeholder="Image URL"
        cols="30"
        rows="10"
      />
      <input
        class="input full_width"
        v-model="book.title"
        type="text"
        placeholder="Title"
      />
      <input
        class="input full_width"
        v-model="book.author"
        type="text"
        placeholder="Author"
      />
      <div class="page_input full_width">
        <input
          name="total-pages"
          v-model="book.totalPages"
          class="input"
          type="number"
          pattern="\d*"
          placeholder="#"
        />
        <label for="total-pages">total pages</label>
      </div>
      <div class="page_input full_width">
        <input
          name="pages-read"
          v-model="book.readPages"
          class="input"
          type="number"
          pattern="\d*"
          placeholder="#"
        />
        <label for="pages-read">pages read</label>
      </div>
      <div class="full_width" v-if="book.readPages >= book.totalPages">
        <label for="finished-date">Finished on</label>
        <input
          class="input finished_date_input"
          type="date"
          name="finished-date"
          v-model="finishedDate"
          @change="test"
        />
      </div>
      <button type="submit" class="update_book_button black_button full_width">
        Update Book
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import helpers from "../../helpers";

import ProgressCircle from "../ProgressCircle";

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  components: {
    Multiselect,
    ProgressCircle
  },
  data() {
    return {
      selectedShelves: [],
      updateProgressMode: false,
      editMode: false,
      finishedDate: "",
      startingPage: 0,
      newPage: 0,
      sessionDuration: 0
    };
  },
  mounted() {
    if (this.book?.shelves.length && this.shelves.length) {
      const filteredShelves = this.shelves.filter(s => {
        return this.book.shelves.includes(s.id);
      });
      this.selectedShelves = filteredShelves;
    }
    this.finished = this.book.finished;
  },
  computed: {
    ...mapGetters(["shelves"]),
    percentComplete: function() {
      if (this.book.totalPages && this.book.readPages) {
        let percent = this.book.readPages / this.book.totalPages;
        percent = Math.round(percent * 100);
        return percent;
      } else {
        return 0;
      }
    },
    dateFinished: function() {
      if (this.book.finished) {
        return helpers.formatTimestamp(this.book.finished);
      } else {
        return "";
      }
    }
  },
  methods: {
    test() {
      console.log(this.book.changes);
    },
    remainingTime() {
      const pagesLeft = this.book.totalPages - this.book.readPages;
      const changesWithDuration = this.book.changes.filter(c => {
        return c.payload.duration > 0;
      });
      const pagesPerMinData = changesWithDuration.map(c => {
        const pagesRead = c.payload.newValue - c.payload.oldValue;
        return pagesRead / c.payload.duration;
      });
      if (pagesPerMinData.length) {
        const averageDuration =
          pagesPerMinData.reduce((a, b) => a + b) / pagesPerMinData.length;
        const pagesPerMin = Math.round((1 / averageDuration) * 100) / 100;
        const timeRemaining = pagesLeft / averageDuration;
        const hoursRemaining = Math.floor(timeRemaining / 60);
        const minutesRemaining = Math.round(
          timeRemaining - hoursRemaining * 60
        );
        return `${hoursRemaining} hrs ${minutesRemaining} mins (${pagesPerMin} p/min)`;
      } else {
        return "";
      }
    },
    historyMessage(change) {
      const time = this.formatTimestamp(change.payload.timestamp);
      let duration = "";
      let prettyAction = "";
      if (change.payload.duration) {
        duration = ` in ${change.payload.duration} minutes`;
      }
      if (change.action === "updatePage") {
        prettyAction = `Read ${change.payload.oldValue}-${change.payload.newValue}${duration}`;
      } else {
        // eslint-disable-next-line prettier/prettier
        prettyAction = "Updated book info"
      }
      return `${time} - ${prettyAction}`;
    },
    formatTimestamp(timestamp) {
      return helpers.formatTimestamp(timestamp);
    },
    startUpdateProgressMode() {
      this.startingPage = this.book.readPages;
      this.newPage = this.book.readPages;
      this.updateProgressMode = true;
    },
    editBook() {
      const fullDate = new Date(this.book.finished);
      const year = fullDate.getFullYear();
      let month = fullDate.getMonth() + 1;
      let zero = "";
      if (month.toString.length === 1) {
        zero = "0";
      }
      const date = fullDate.getDate();
      this.finishedDate = `${year}-${zero}${month}-${date}`;
      this.editMode = true;
    },
    updateBook(book) {
      book.readPages = Number.parseInt(book.readPages);
      book.totalPages = Number.parseInt(book.totalPages);
      if (!book.readPages) {
        book.inProgress = false;
        book.finished = "";
      } else if (book.totalPages > book.readPages) {
        book.inProgress = true;
        book.finished = "";
      } else if (book.readPages === book.totalPages) {
        book.inProgress = false;
      }
      let newChange = helpers.addChange("updateBook", {
        oldValue: null,
        newValue: null,
        duration: null
      });
      this.$store
        .dispatch("updateBook", { book: this.book, change: newChange })
        .then(() => {
          this.editMode = false;
        });
    },
    startReading() {
      this.book.inProgress = true;
      this.book.finished = "";
      this.book.readPages = 0;
      const payload = { book: this.book, action: "startReading" };
      this.$store.dispatch("startReading", payload);
    },
    updateProgress() {
      let newChange = helpers.addChange("updatePage", {
        oldValue: this.startingPage,
        newValue: this.newPage,
        duration: parseInt(this.sessionDuration)
      });
      this.$store
        .dispatch("updatePage", { book: this.book, change: newChange })
        .then(() => {
          this.updateProgressMode = false;
        });
    },
    deleteBook(book) {
      this.$store.dispatch("deleteBook", book).then(() => {
        this.$store.commit("closeDrawer");
      });
    },
    finishBook(book) {
      book.readPages = book.totalPages;
      book.inProgress = false;
      book.finished = Date.now();
      const payload = { book: book, action: "finishBook" };
      this.$store.dispatch("updateBook", payload);
    }
  },
  watch: {
    selectedShelves: function(newShelves) {
      this.book.shelves = newShelves.map(s => {
        return s.id;
      });
      // this.$store.dispatch("updateBook", this.book);
    },
    finishedDate: function(date) {
      this.book.finished = new Date(date);
    }
  }
};
</script>

<style lang="scss">
.inspect_book_container {
  padding: 3rem;
}
.edit_icon {
  position: absolute;
  right: 2rem;
  top: 200px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 2rem;
}
.edit_book,
.inspect_book {
  display: flex;
  flex-direction: column;
  align-items: center;
  .inspect_book_row,
  .multiselect {
    margin-top: 2rem;
  }
  .image_input {
    margin: 0;
  }
}
.finished_date_input {
  margin-left: 1rem;
}
.update_book_button {
  margin-top: 2rem;
}
.inspect_book_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  & > * {
    flex: 1;
  }
  button:nth-child(n + 2) {
    margin-left: 1rem;
  }
  &.finished_row {
    justify-content: flex-start;
    & > svg {
      flex: 0;
    }
  }
}
.drawer_img {
  height: 192px;
  width: 128px;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: top;
  }
}
.progress_row {
  .tracker {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
.update_progress_input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  input {
    margin: 0;
  }
}
.update_progress_buttons {
  display: flex;
  justify-content: flex-end;
  button {
    width: 67px;
  }
}
.finished_icon {
  color: #71c691;
}
</style>
