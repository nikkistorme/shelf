<template>
  <div class="readthroughs d-flex flex-column gap-1">
    <div class="d-flex ai-center gap-half">
      <h2 class="readthroughs__heading">Readthroughs</h2>
    </div>
    <div class="d-flex flex-column gap-half">
      <ol v-if="readthroughs?.length" class="d-flex flex-column">
        <li
          v-for="(rt, i) in readthroughs"
          :class="`readthrough ${i} d-flex jc-center ai-center`"
          :key="i"
        >
          <div
            v-if="editingReadthrough?.index !== i"
            class="d-flex jc-between ai-start w-100"
          >
            <p class="d-flex jc-between">
              From&nbsp;
              <span v-if="rt?.start" class="underline">
                {{ formatDate(rt.start) }}
              </span>
              <span v-else>&nbsp;_______</span>
              &nbsp;to&nbsp;
              <span v-if="rt?.end" class="underline">
                {{ formatDate(rt.end) }}
              </span>
              <span v-else>&nbsp;_______</span>
            </p>
            <IconEditPencil
              class="edit-icon cursor-pointer ml-1"
              @click="editReadthrough(rt, i)"
            />
          </div>
          <form
            v-else
            class="d-flex jc-center ai-center gap-1 w-100"
            @submit.prevent="saveReadthrough(editingReadthrough)"
          >
            <div class="d-flex w-100 gap-half">
              <InputDate
                id="readthrough-start"
                class="edit-rt__input"
                v-model:value="editingReadthrough.start"
              />
              <span>to</span>
              <InputDate
                id="readthrough-end"
                class="edit-rt__input"
                v-model:value="editingReadthrough.end"
              />
            </div>
            <IconClose
              class="edit-rt__icon cancel red cursor-pointer"
              @click="editingReadthrough = null"
            />
            <IconCheckmark
              class="edit-rt__icon save cursor-pointer"
              type="submit"
            />
          </form>
        </li>
      </ol>
      <p v-else class="readthroughs__empty">No readthroughs yet</p>
    </div>
    <div class="d-flex flex-column gap-1">
      <div class="rt__new">
        <form
          v-if="newReadthrough"
          class="d-flex jc-center ai-center gap-1 w-100"
          @submit.prevent="saveReadthrough(newReadthrough)"
        >
          <div class="d-flex ai-center w-100 gap-half">
            <InputDate
              id="readthrough-start"
              class="edit-rt__input"
              v-model:value="newReadthrough.start"
            />
            <span>to</span>
            <InputDate
              id="readthrough-end"
              class="edit-rt__input"
              v-model:value="newReadthrough.end"
            />
          </div>
          <button
            type="button"
            class="button-style-reset cursor-pointer"
            @click="newReadthrough = null"
          >
            <IconClose class="edit-rt__icon cancel red" />
          </button>
          <button type="submit" class="button-style-reset cursor-pointer">
            <IconCheckmark class="edit-rt__icon save" />
          </button>
        </form>
      </div>
      <ButtonDefault @click="addReadthrough">Add a readthrough</ButtonDefault>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~/store/BookStore";
import { formatDate, formatTimestampz } from "~/services/timeService";

export default {
  setup() {
    const bookStore = useBookStore();
    const { userBook } = storeToRefs(bookStore);

    const readthroughs = computed(() => {
      return userBook.value.readthroughs.sort((a, b) => {
        return a.end > b.end ? -1 : 1;
      });
    });

    const editingReadthrough = ref(null);
    const editReadthrough = (readthrough, index) => {
      editingReadthrough.value = {
        start: null,
        end: null,
        index,
      };
      if (readthrough.start)
        editingReadthrough.value.start = formatTimestampz(
          readthrough.start,
          "MM/DD/YYYY"
        );
      if (readthrough.end)
        editingReadthrough.value.end = formatTimestampz(
          readthrough.end,
          "MM/DD/YYYY"
        );
      newReadthrough.value = null;
    };

    const newReadthrough = ref(null);
    const addReadthrough = () => {
      newReadthrough.value = {
        start: null,
        end: null,
        index: -1,
      };
      editingReadthrough.value = null;
    };

    const saveReadthrough = async (newRt) => {
      let rtToAdd = {
        start: newRt.start,
        end: newRt.end,
      };
      rtToAdd = formatReadthrough(rtToAdd, "mm/dd/yyyy");

      const updatedReadthroughs = readthroughs.value.map((rt, i) => {
        if (i === newRt.index) return rtToAdd;
        return rt;
      });
      if (newRt.index === -1) updatedReadthroughs.push(rtToAdd);

      if (userBook.value.status === "unread") {
        await bookStore.updateUserBook(userBook.value.id, {
          status: "finished",
          readthroughs: updatedReadthroughs,
        });
      } else {
        await bookStore.updateUserBook(userBook.value.id, {
          readthroughs: updatedReadthroughs,
        });
      }

      editingReadthrough.value = null;
      newReadthrough.value = null;
    };

    return {
      userBook,
      readthroughs,
      formatDate,
      formatTimestampz,
      editingReadthrough,
      editReadthrough,
      saveReadthrough,
      newReadthrough,
      addReadthrough,
    };
  },
};
</script>

<style scoped>
.readthroughs__toggle-icon {
  transform: rotate(270deg);
  width: var(--spacing-size-1);
  height: var(--spacing-size-1);
  transition: transform 0.2s ease-in-out;
}
.readthroughs__toggle-icon.flip {
  transform: rotate(360deg);
}
.readthrough {
  height: 30px;
  white-space: nowrap;
}
.readthrough .underline {
  border-bottom: var(--border-2);
}
.edit-rt__icon.cancel {
  width: 20px;
  height: 20px;
}
.edit-rt__icon.save {
  width: 25px;
  height: 25px;
}
</style>
