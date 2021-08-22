<template>
  <div class="shelf">
    <div class="shelf-content">
      <div class="book" v-for="(book, i) in sortedBooks" :key="i">
        <div class="img" @click="openDrawer(book)">
          <img :src="book.imageLinks.thumbnail" :alt="book.title" />
        </div>
      </div>
    </div>
    <div class="shelf-floor">
      <h4>{{ shelf.name }}</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

const sortVolumes = (a, b) => {
  if (a.goalDate && b.goalDate) {
    return a.goalDate > b.goalDate;
  } else if (a.goalDate) {
    return -1;
  } else if (b.goalDate) {
    return 1;
  } else {
    return 0;
  }
};

export default {
  props: {
    shelf: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(["showNav"]),
    sortedBooks: function() {
      let sorted = this.shelf.volumes;
      sorted.sort((a, b) => sortVolumes(a, b));
      return sorted;
    }
  },
  methods: {
    ...mapMutations(["setDrawer"]),
    openDrawer(book) {
      this.$store.commit("setDrawer", book);
    }
  }
};
</script>

<style lang="scss">
.shelf {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 5rem;
}
.shelf-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2px;
  overflow: auto;
}
.shelf-floor {
  height: 25px;
  width: 100%;
  background: white;
  border: .5px black solid;
  padding-left: 2px;
  box-shadow: black 0px 2px 5px -2px;
}
.book {
  padding-left: 1rem;
}
.img {
  position: relative;
  height: 100px;
  min-width: 67px;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: bottom;
  }
}
</style>
