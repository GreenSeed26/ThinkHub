import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeDateFormat(
  date: Date | number | undefined,
  lang = "en",
) {
  if (!date) return;
  const timeMs = typeof date === "number" ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat(lang, {
    numeric: "auto",
  });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-us", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function convertToLocaleString(createdAt: string | Date | null) {
  const dateString = createdAt as string;
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return formattedDate; // Output: May 10, 2024
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sluggify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/^a-z0-9-/g, "");
}

export function capitalizeFirstChar(stringToFormat: string) {
  const formattedString =
    stringToFormat.charAt(0) + stringToFormat.slice(1).toLowerCase();

  return formattedString;
}

export function timer(duration: number, numLen: number) {
  let count = 0;

  const interval = setInterval(() => {
    count++;
    console.log(count);

    if (count >= numLen) {
      clearInterval(interval);
    }
  }, duration * 1000);
}
