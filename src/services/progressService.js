export const progressTypeOptions = [
  {
    label: "pages",
    value: "pages",
  },
  {
    label: "%",
    value: "percent",
  },
];

export const durationOptions = [
  {
    label: "Start-End",
    value: "start-end",
  },
  {
    label: "Length",
    value: "length",
  },
];

export const durationForm = {
  duration: 0,
  logDuration: false,
  durationType: "start-end",
  durationStart: 0,
  durationEnd: 0,
  durationOptions: durationOptions,
};

const setProgressAfterTypeSwap = (type, progress, total) => {
  if (type === "percent") {
    return Math.round((progress / total) * 100);
  } else if (type === "pages") {
    return Math.round((progress / 100) * total);
  }
};

export default {
  progressTypeOptions,
  durationForm,
  setProgressAfterTypeSwap,
};
