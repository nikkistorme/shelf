<template>
  <div v-if="detailedBook.description" class="book-details__description card">
    <p
      class="book-details__description-text"
      :class="{ expanded: expandDescription }"
    >
      {{ detailedBook.description }}
    </p>
    <InlineButton
      class="book-details__description-expand"
      :text="expandDescription ? 'show less' : 'show more'"
      underline
      color="blue"
      @click="toggleDescription"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InlineButton from "../buttons/InlineButton.vue";

export default {
  components: { InlineButton },
  data() {
    return {
      expandDescription: false,
    };
  },
  computed: {
    ...mapGetters(["detailedBook"]),
  },
  methods: {
    toggleDescription() {
      this.expandDescription = !this.expandDescription;
    },
  },
};
</script>

<style>
.book-details__description {
  position: relative;
}
.book-details__description-text:not(.expanded) {
  max-height: calc(var(--line-height-1) * 6);
  overflow: hidden;
}
.book-details__description-expand {
  position: absolute;
  right: var(--spacing-size-2);
  bottom: 4px;
  height: fit-content;
  padding-left: var(--spacing-size-1) !important;
  background: white !important;
}
</style>
