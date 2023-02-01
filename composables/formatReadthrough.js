import { dateToTimestampz } from "~/services/timeService.js";

export function formatReadthrough(readthrough, format = "YYYY-MM-DD") {
  if (readthrough.start)
    readthrough.start = dateToTimestampz(readthrough.start, format);
  if (readthrough.end)
    readthrough.end = dateToTimestampz(readthrough.end, format);
  return readthrough;
}
