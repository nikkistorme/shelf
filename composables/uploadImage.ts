// import sharp from "sharp";

// const imagesModel = {
//   600: "",
//   900: "",
//   1200: "",
//   2400: "",
// }

// const getUploadURL = async () => {
//   const { uploadURL } = await $fetch("/api/image", {
//     method: "post",
//   });
//   return uploadURL;
// }

// const addImageSizes = async (form: FormData, sizes: string[], image: any) => {
//   for (const size of sizes) {
//     const resized = await resizeImage(image, parseInt(size));
//     const blob = new Blob([resized], { type: "image/webp" });
//     form.append("file", blob);
//   }
//   return form;
// };

// const fileFromEvent = (event: { target: { files: any[]; }; }) => {
//   const file = event.target.files[0];
//   return file;
// };

// const resizeImage = async (file: any, width: number) => {
//   return await sharp(file).resize(width).toBuffer();
// };

export async function uploadImage(event: any) {
  // const nuxtApp = useNuxtApp();
  // let images = {...imagesModel};
  // const sizes = Object.keys(images);
  
  // let form = new FormData();

  // const file = fileFromEvent(event); // Get uploaded image file
  // const webp = sharp(file).webp({ quality: 80 }) // Convert to webp
  // try {
  //   form = await addImageSizes(form, sizes, file) // Convert to multiple sizes
  //   // Upload images to Cloudflare
  //   const response = await fetch(await getUploadURL(), {
  //     method: "POST",
  //     body: form,
  //   });
  //   const data = await response.json();
  //   const imageResults = data.result
  //   console.log("🚀 ~ imageResults", imageResults);
  //   return imageResults;
  // } catch (err) {
  //   throw err;
  // }
  return true;
}
