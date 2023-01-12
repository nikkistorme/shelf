export async function imageUploadUrl() {
  const { uploadURL } = await $fetch("/api/image", {
    method: "post",
  });
  return uploadURL;
};