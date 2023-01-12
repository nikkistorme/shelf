<template>
  <div class="book-page__progress d-flex gap-1 ai-center pb-1">
    <div class="d-flex ai-center gap-1">
      <IconProgressCircle :percent="percentComplete" />
      <div class="d-flex flex-column">
        <p class="book-page__stats-text">
          {{ props.book.current_page }} / {{ props.book.total_pages }}
        </p>
        <p>{{ pagesReadToday }} pages read today</p>
      </div>
    </div>
    <ButtonDefault
      flavor="tiny"
      class="ml-auto"
      @click="openUpdateProgressModal"
    >
      Update
    </ButtonDefault>
    <ModalUpdateProgress
      v-if="updatingProgress"
      :open="updatingProgress"
      :book="props.book"
    />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { pagesReadToday as statsPagesToday } from "~/services/statsService";
import { useModalStore } from "~/store/ModalStore";

export default {
  props: {
    book: Object,
  },
  setup(props) {
    const percentComplete = computed(() => {
      if (props.book.total_pages && props.book.current_page) {
        let percent = props.book.current_page / props.book.total_pages;
        percent = Math.round(percent * 100);
        return percent;
      } else {
        return 0;
      }
    });

    const pagesReadToday = computed(() => {
      return statsPagesToday([props.book]);
    });

    const updatingProgress = ref(false);
    const modalStore = useModalStore();

    function openUpdateProgressModal() {
      updatingProgress.value = true;
      modalStore.openModal();
    }

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        updatingProgress.value = false;
      }
    });

    return {
      props,
      percentComplete,
      pagesReadToday,
      updatingProgress,
      openUpdateProgressModal,
    };
  },
};
</script>

<style>
.book-page__progress {
  width: 100%;
  max-width: 350px;
  border-bottom: var(--default-input-border);
}
.book-page__stats-text {
  margin-bottom: calc(var(--spacing-size-1) / 4);
}
.book-page__stats-divide {
  margin: 0;
  transition: all 0.2s 0.3s ease-in-out;
}
.book-page__stats-divide.hidden {
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
</style>
