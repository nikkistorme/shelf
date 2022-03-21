<template>
  <div class="confirm-modal d-flex flex-column gap-2">
    <p>{{ confirmAction.message }}</p>
    <div class="confirm-modal__toolbar d-flex jc-end gap-1 w-100">
      <DefaultButton
        color="red"
        :text="confirmAction.cancelMessage"
        @click="cancel"
      />
      <DefaultButton
        color="blue"
        :text="confirmAction.confirmMessage"
        @click="confirm"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import DefaultButton from "./buttons/DefaultButton.vue";

export default {
  components: { DefaultButton },
  computed: {
    ...mapGetters(["confirmAction"]),
  },
  methods: {
    ...mapMutations(["setConfirmAction"]),
    cancel() {
      this.setConfirmAction({});
    },
    async confirm() {
      await this.confirmAction.confirmMethod();
      this.setConfirmAction({});
    },
  },
};
</script>

<style>
.confirm-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  width: auto;
  max-width: 450px;
  padding: var(--spacing-size-2) var(--spacing-size-2) var(--spacing-size-2)
    var(--spacing-size-2);
  background-color: white;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-1);
  z-index: 1;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
