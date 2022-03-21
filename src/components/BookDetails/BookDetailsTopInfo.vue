<template>
  <form
    class="book-details__top-info d-flex flex-column jc-center"
    @submit.prevent="updateField"
  >
    <div class="book-details__title d-flex ai-center gap-1 mb-1">
      <h2>{{ detailedBook.title }}</h2>
    </div>
    <h3 class="book-details__author">by {{ detailedBook.author }}</h3>
    <div
      class="book-details__pages pencil-hover-container d-flex flex-column mb-1"
    >
      <div class="d-flex gap-1">
        <p>{{ detailedBook.totalPages }} pages</p>
        <EditPencil
          v-if="detailedBook.id"
          v-show="editingField !== 'totalPages'"
          @click="editField('totalPages')"
        />
      </div>
      <div
        v-if="editingField === 'totalPages'"
        class="book-details__pages-edit d-flex ai-center gap-1"
      >
        <NumberInput v-model="editingFieldValue" />
        <CloseIcon color="red" class="cursor-pointer" @click="editField('')" />
        <CheckmarkIcon
          class="book-details__pages-edit-confirm cursor-pointer"
          @click="updateField"
        />
      </div>
    </div>
    <DefaultButton
      v-if="!detailedBook.id && !detailedBookLoading"
      text="Add book to library"
      color="blue"
      underline
      class="mt-1"
      @click="addBook"
    />
    <p v-if="!detailedBook.id && detailedBookLoading">Adding book...</p>
    <BookShelves v-if="detailedBook.id && desktopLayout" />
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { makeChange } from "../../services/changeService.js";

import EditPencil from "../icons/EditPencil.vue";
import NumberInput from "../forms/NumberInput.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import CheckmarkIcon from "../icons/CheckmarkIcon.vue";

export default {
  components: {
    EditPencil,
    NumberInput,
    CloseIcon,
    CheckmarkIcon,
  },
  data() {
    return {
      editingField: "",
      editingFieldValue: null,
    };
  },
  computed: {
    ...mapGetters(["detailedBook"]),
  },
  methods: {
    ...mapActions(["updateBookField"]),
    editField(field) {
      this.editingField = field;
      this.editingFieldValue = this.detailedBook[field];
    },
    async updateField() {
      await this.updateBookField({
        book: this.detailedBook,
        change: makeChange("updateField", {
          oldValue: this.detailedBook[this.editingField],
          newValue: this.editingFieldValue,
          field: this.editingField,
        }),
        field: this.editingField,
      });
      this.editingField = null;
    },
  },
};
</script>

<style>
.book-details__top-info {
  justify-self: start;
  width: fit-content;
}
.book-details__title {
  font-size: var(--font-size-2);
}
.book-details__author {
  font-size: var(--font-size-1);
}
.book-details__pages-edit-confirm {
  height: 30px;
  width: 30px;
}
@media (min-width: 768px) {
  .book-details__top-info {
    grid-area: top;
    align-self: start;
  }
  .book-details__author {
    font-size: var(--font-size-2);
    font-weight: normal;
  }
}
</style>
