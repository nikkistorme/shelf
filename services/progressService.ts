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
  durationStart: null,
  durationEnd: null,
  durationOptions: durationOptions,
};
