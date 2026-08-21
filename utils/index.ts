import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatToISO = (dateObj: Dayjs): string => dateObj.format("YYYY-MM-DD");

export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseISOToDayjs = (isoString?: string | null): Dayjs | null =>
  isoString ? dayjs(isoString) : null;
