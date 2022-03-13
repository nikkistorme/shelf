export const HhMmDifferenceInMinutes = (time1, time2) => {
  const start = new Date(`1111-11-11 ${time1}`);
  const end = new Date(`1111-11-11 ${time2}`);
  const diffMilliseconds = end - start;
  const diffMinutes = Math.round(
    ((diffMilliseconds % 86400000) % 3600000) / 60000
  );
  return diffMinutes;
};
