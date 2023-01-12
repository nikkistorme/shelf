export default defineEventHandler(async (event) => {
  try {
    const response = await fetch(process.env.CLOUDFLARE_IMAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    return error;
  }
});
