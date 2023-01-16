import { dateToTimestampz } from "~/services/timeService.js";

export function formatReadthrough(readthrough) {
  if (readthrough.start)
    readthrough.start = dateToTimestampz(readthrough.start, "YYYY-MM-DD");
  if (readthrough.end)
    readthrough.end = dateToTimestampz(readthrough.end, "YYYY-MM-DD");
  return readthrough;
}
