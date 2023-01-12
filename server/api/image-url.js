const getUploadURL = async () => {
  const { uploadURL } = await $fetch("/api/image", {
    method: "post",
  });
  return uploadURL;
};

export default defineEventHandler(async (event) => {
  try {
    const url = await readBody(event);
    const urlResponse = await fetch(url);
    const blob = await urlResponse.blob();

    let form = new FormData();
    form.append("file", blob);

    const uploadResponse = await fetch(await getUploadURL(), {
      method: "POST",
      body: form,
    });
    const uploadData = await uploadResponse.json();
    const imageResults = uploadData.result;
    return imageResults;
  } catch (err) {
    return err;
  }
});
