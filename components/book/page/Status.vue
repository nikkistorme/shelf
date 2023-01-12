<template>
  <div class="bp-status">
    <div
      class="d-flex ai-center gap-half w-fit-content cursor-pointer"
      @click="beginChangeStatus"
    >
      <div class="bp-status_update-icon d-flex flex-column jc-space-around">
        <IconArrowDown class="up" />
        <IconArrowDown class="down" />
      </div>
      <h2>{{ displayStatus }}</h2>
    </div>
    <ModalGeneral
      v-if="changingStatus"
      class="bp-status_change-modal d-flex flex-column gap-1"
    >
      <fieldset
        id="status-change-modal"
        role="radio-group"
        aria-labelledby="id-status-label"
      >
        <legend id="id-status-label">New Status</legend>
        <label
          class="d-flex ai-center gap-half"
          role="radio"
          v-for="(status, i) in newStatusOptions"
          :key="i"
          :for="status.value"
        >
          <input
            type="radio"
            name="new-status"
            :id="status.value"
            :value="status.value"
            v-model="newStatus"
          />
          <span>{{ status.label }}</span>
        </label>
      </fieldset>
      <div class="bp-status_additional-options">
        <div
          v-if="newStatusOptions.find((o) => o.value === 'unread')"
          :style="{ visibility: newStatus !== 'unread' ? 'hidden' : '' }"
        >
          <p>
            <span class="text_warning">WARNING:</span> Marking this book as
            {{ statusOptions.unread.label }} will remove its readthrough
            history.
          </p>
          <ul>
            <li v-for="(readthrough, i) in userBook.readthroughs" :key="i">
              -
              <span v-if="readthrough.start">
                Read from
                {{ formatDateFromTimestampz(readthrough.start, "YYYY-MM-DD") }}
                to
              </span>
              <span v-else>Finished on</span>
              {{ formatDateFromTimestampz(readthrough.end, "YYYY-MM-DD") }}
            </li>
          </ul>
        </div>
        <div
          v-if="newStatusOptions.find((o) => o.value === 'finished')"
          :style="{ visibility: newStatus !== 'finished' ? 'hidden' : '' }"
        >
          <InputDefault
            type="date"
            id="start-date"
            v-model="newReadthrough.start"
            label="Started On (optional)"
            class=""
          />
          <InputDefault
            type="date"
            id="end-date"
            v-model="newReadthrough.end"
            label="Finished On (optional)"
            class=""
          />
        </div>
      </div>
      <div class="buttons d-flex jc-between">
        <ButtonDefault @click="closeStatusChange" color="red"
          >Cancel</ButtonDefault
        >
        <ButtonDefault @click="applyStatusChange" :disabled="!newStatus"
          >Apply</ButtonDefault
        >
      </div>
    </ModalGeneral>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";
import { useShelfStore } from "~/store/ShelfStore";
import { useModalStore } from "~/store/ModalStore";

import {
  todayWithFormat,
  dateWithFormatToTimestampz,
  formatDateFromTimestampz,
} from "~/services/timeService.js";

export default {
  setup() {
    const bookStore = useBookStore();
    const shelfStore = useShelfStore();
    const modalStore = useModalStore();

    const { userBook } = storeToRefs(bookStore);

    const displayStatus = computed(() => {
      let shelf;
      switch (userBook.value.status) {
        case "finished":
          shelf = shelfStore.finishedShelf;
          return shelf?.name ? shelf.name : "Finished";
        case "in_progress":
          shelf = shelfStore.inProgressShelf;
          return shelf?.name ? shelf.name : "In Progress";
        case "unread":
          shelf = shelfStore.unreadShelf;
          return shelf?.name ? shelf.name : "Unread";
        default:
          shelf = shelfStore.unreadShelf;
          return shelf?.name ? shelf.name : "Unread";
      }
    });

    const statusOptions = ref({
      finished: { value: "finished", label: "Finished" },
      in_progress: { value: "in_progress", label: "In Progress" },
      unread: { value: "unread", label: "Unread" },
      shelved: { value: "shelved", label: "Shelved" },
    });

    const changingStatus = ref(false);
    const beginChangeStatus = () => {
      changingStatus.value = true;
      modalStore.openModal();
    };

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        changingStatus.value = false;
      }
    });

    const newStatusOptions = computed(() => {
      const allOptions = statusOptions.value;
      let options = [];
      switch (userBook.value.status) {
        case "finished":
          options = [allOptions.in_progress, allOptions.unread];
          break;
        case "in_progress":
          options = [allOptions.finished, allOptions.shelved];
          break;
        case "unread":
          options = [allOptions.in_progress, allOptions.finished];
          break;
        default:
          options = [allOptions.in_progress, allOptions.finished];
          break;
      }
      return options;
    });

    const newStatus = ref(null);

    const closeStatusChange = () => {
      newStatus.value = null;
      changingStatus.value = false;
      modalStore.closeModal();
    };

    const newReadthrough = ref({
      start: null,
      end: todayWithFormat("YYYY-MM-DD"),
    });

    const applyFinished = async () => {
      let readthroughFinal = { ...newReadthrough.value };
      if (!userBook.value.readthroughs?.length)
        userBook.value.readthroughs = [];
      if (readthroughFinal.start)
        readthroughFinal.start = dateWithFormatToTimestampz(
          readthroughFinal.start,
          "YYYY-MM-DD"
        );
      if (readthroughFinal.end)
        readthroughFinal.end = dateWithFormatToTimestampz(
          readthroughFinal.end,
          "YYYY-MM-DD"
        );
      const bookUpdates = {
        readthroughs: [...userBook.value.readthroughs, readthroughFinal],
        status: "finished",
      };
      try {
        await bookStore.finishReadingBook(userBook.value.id, bookUpdates);
      } catch (error) {
        throw error;
      }
    };

    const applyStatusChange = async () => {
      let bookUpdates;
      switch (newStatus.value) {
        case "in_progress":
          try {
            await bookStore.startReadingBook(userBook.value);
          } catch (error) {
            closeStatusChange();
            break;
          }
          closeStatusChange();
          break;
        case "finished":
          try {
            await applyFinished();
          } catch (error) {
            closeStatusChange();
            break;
          }
          closeStatusChange();
          break;
        case "unread":
          bookUpdates = {
            status: "unread",
            readthroughs: [],
          };
          try {
            await bookStore.updateUserBook(userBook.value.id, bookUpdates);
          } catch (error) {
            closeStatusChange();
            break;
          }
          closeStatusChange();
          break;
        default:
          bookUpdates = {
            status: userBook.value.readthroughs.length ? "finished" : "unread",
            goal: null,
          };
          try {
            await bookStore.updateUserBook(userBook.value.id, bookUpdates);
          } catch (error) {
            closeStatusChange();
            throw error;
          }
          closeStatusChange();
          break;
      }
    };

    return {
      userBook,
      displayStatus,
      changingStatus,
      beginChangeStatus,
      statusOptions,
      newStatusOptions,
      newStatus,
      closeStatusChange,
      applyStatusChange,
      newReadthrough,
      formatDateFromTimestampz,
    };
  },
};
</script>

<style scoped>
.bp-status_update-icon .up,
.bp-status_update-icon .down {
  width: var(--spacing-size-1);
  height: var(--spacing-size-1);
}

.bp-status_update-icon .up {
  transform: rotate(180deg);
}

.bp-status_change-modal {
  min-width: 300px;
}

.bp-status_change-modal input[type="radio"] {
  margin: 0;
  width: var(--spacing-size-1);
  height: var(--spacing-size-1);
}
</style>
