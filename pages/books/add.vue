<template>
  <div class="add-book d-flex jc-center">
    <form
      class="add-book__form d-flex flex-column gap-1 w-100"
      @submit.prevent="submitForm"
    >
      <div class="add-book__cover d-flex jc-center">
        <img
          v-if="bookToAdd.cover"
          :src="bookToAdd.cover"
          alt="the new book's cover"
        />
        <div
          v-else
          class="add-book__cover-placeholder d-flex flex-column jc-between ai-center p-1"
        />
      </div>
      <InputSegmentedControl
        v-model="coverUploadMethod"
        :options="[
          { label: 'Image URL', value: 'url' },
          { label: 'Image Upload', value: 'upload' },
        ]"
      />
      <div
        v-if="coverUploadMethod === 'url'"
        class="add-book_upload-method d-flex ai-end gap-1"
      >
        <InputDefault id="cover-url" v-model="coverURL" type="text" />
        <ButtonDefault
          type="button"
          @click="uploadImageURL(coverURL)"
          :disabled="!coverURL.length"
        >
          Add image
        </ButtonDefault>
      </div>
      <div v-if="coverUploadMethod === 'upload'" class="add-book_upload-method">
        <label class="cover-upload__label" for="cover-upload">
          Upload image file
        </label>
        <input
          id="cover-upload"
          class="cover-upload__input"
          type="file"
          @change="uploadImageFile"
        />
      </div>
      <InputDefault
        id="title"
        v-model="bookToAdd.title"
        type="text"
        label="Title"
        :required="true"
      />
      <InputDefault
        id="author"
        v-model="bookToAdd.author"
        type="text"
        label="Author"
      />
      <InputNumber
        id="total-pages"
        v-model="bookToAdd.total_pages"
        label="Pages"
      />
      <InputTextarea
        id="description"
        v-model="bookToAdd.description"
        label="Description"
      />
      <InputDefault
        id="publisher"
        v-model="bookToAdd.publisher"
        type="text"
        label="Publisher"
      />
      <InputNumber
        id="isbn-10"
        class="add-book__isbn"
        v-model="bookToAdd.isbn"
        label="ISBN 10"
      />
      <InputNumber
        id="isbn-13"
        class="add-book__isbn"
        v-model="bookToAdd.isbn_13"
        label="ISBN 13"
      />
      <ButtonDefault :disabled="disableSubmission" type="submit">
        Add book
      </ButtonDefault>
    </form>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useBookStore } from "~~/store/BookStore";
import { bookSchema } from "~~/services/bookService";

export default {
  setup() {
    definePageMeta({
      middleware: ["user-auth"],
    });

    const bookStore = useBookStore();
    const { bookToAdd, loading } = storeToRefs(bookStore);

    if (!bookToAdd.value) bookToAdd.value = bookSchema();

    const coverUploadMethod = ref("url");

    const uploadImageFile = async (event) => {
      loading.value = true;

      const form = new FormData();
      form.append("file", event.target.files[0]);

      try {
        const response = await fetch(await imageUploadUrl(), {
          method: "POST",
          body: form,
        });
        const data = await response.json();
        const imageResults = data.result;
        bookToAdd.value.cover = imageResults.variants[0];
        loading.value = false;
      } catch (error) {
        console.log("🚀 ~ error", error);
        loading.value = false;
      }
    };

    const coverURL = ref("");
    const uploadImageURL = async (url) => {
      loading.value = true;
      try {
        const response = await $fetch("/api/image-url", {
          method: "POST",
          body: url,
        });
        bookToAdd.value.cover = response.variants[0];
        loading.value = false;
      } catch (error) {
        console.log("🚀 ~ error", error);
        loading.value = false;
      }
    };

    const disableSubmission = computed(() => {
      return (
        loading.value ||
        !bookToAdd.value.cover ||
        !bookToAdd.value.title ||
        !bookToAdd.value.author ||
        !bookToAdd.value.total_pages
      );
    });

    const router = useRouter();
    async function submitForm() {
      if (disableSubmission.value) return;
      await bookStore.addNewBook();
      if (bookStore.book?.id) await router.push(`/books/${bookStore.book.id}`);
    }

    return {
      loading,
      bookToAdd,
      coverUploadMethod,
      coverURL,
      uploadImageFile,
      uploadImageURL,
      disableSubmission,
      submitForm,
    };
  },
};
</script>

<style>
.add-book {
  max-width: 700px;
  margin: 0 auto;
}
.add-book__cover {
  min-height: 250px;
  max-width: 100%;
  width: 175px;
}
.add-book__cover img {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  object-fit: contain;
  object-position: bottom;
  box-shadow: var(--box-shadow-2);
}
.add-book__cover-placeholder {
  height: 250px;
  width: 100%;
  border-radius: 5px;
  background-color: var(--color-grey);
  text-align: center;
}

.add-book_upload-method {
  min-height: 46px;
}

.add-book__isbn input {
  max-width: 250px;
}
</style>
