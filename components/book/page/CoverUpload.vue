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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookStore } from "~~/store/BookStore";
import { newChange, sortChanges } from "~~/services/changeService";

const fileFromEvent = (e: Event): File | null => {
  const target = e.target as HTMLInputElement;
  if (target.files) return target.files[0];
  else return null;
};

const bookStore = useBookStore();
const { loading, userBook } = storeToRefs(bookStore);

async function uploadImage(e: Event): Promise<void> {
  if (!e.target) return;

  const form = new FormData();
  const file = fileFromEvent(e);
  if (!file) return;

  form.append("file", file);

  const { uploadURL } = await $fetch("/api/image", {
    method: "post",
  });

  const response = await fetch(uploadURL, {
    method: "POST",
    body: form,
  });
  const data = await response.json();

  const imageURL = data.result.variants[0];

  if (imageURL && userBook.value) {
    const change: Change = newChange(
      "updateCover",
      userBook.value as UserBook,
      {
        cover: imageURL,
      } as MiscUpdateParam
    );
    let newChanges = [...userBook.value.changes, change];
    newChanges = sortChanges(newChanges);
    const bookUpdates = {
      changes: newChanges,
      cover: imageURL,
    };
    await bookStore.uploadNewCoverImage(userBook.value.id, bookUpdates);
  }
}
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
