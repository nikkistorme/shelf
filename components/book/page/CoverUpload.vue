<template>
  <label class="cover-upload__label" for="cover-upload">
    Update cover image
  </label>
  <input
    id="cover-upload"
    class="cover-upload__input"
    type="file"
    @change="uploadImage"
  />
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~~/store/BookStore";
import { newChange, sortChanges } from "~~/services/changeService";

const fileFromEvent = (event) => {
  const file = event.target.files[0];
  return file;
};

export default {
  setup() {
    const bookStore = useBookStore();
    const { loading, userBook } = storeToRefs(bookStore);

    async function uploadImage(event) {
      const form = new FormData();
      loading.value = true;
      form.append("file", fileFromEvent(event));

      const { id, uploadURL } = await $fetch("/api/image", {
        method: "post",
      });

      const response = await fetch(uploadURL, {
        method: "POST",
        body: form,
      });
      const data = await response.json();

      const imageURL = data.result.variants[0];

      if (imageURL) {
        const change = newChange("updateCover", userBook.value, {
          cover: imageURL,
        });
        let newChanges = [...userBook.value.changes, change];
        newChanges = sortChanges(newChanges);
        const bookUpdates = {
          changes: newChanges,
          cover: imageURL,
        };
        await bookStore.uploadNewCoverImage(userBook.value.id, bookUpdates);
      }
    }

    return {
      uploadImage,
    };
  },
};
</script>

<style>
.cover-upload__input {
  display: none;
}
.cover-upload__label {
  display: flex;
  height: min-content;
  width: fit-content;
  padding: var(--spacing-size-half);
  border: 2px solid transparent;
  border-radius: var(--border-radius-3);
  line-height: var(--font-size-root);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: var(--color-primary);
  color: white;
}
.cover-upload__label:hover {
  filter: brightness(115%);
}
</style>
