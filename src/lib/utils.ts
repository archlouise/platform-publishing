import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SizeBand } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Company size is an attribute derived from employee count, not a type. */
export function sizeBand(employeeCount: number): SizeBand {
  if (employeeCount < 50) return "Small";
  if (employeeCount < 250) return "Medium";
  return "Large";
}

export function sizeBandRange(band: SizeBand) {
  switch (band) {
    case "Small":
      return "1–49 employees";
    case "Medium":
      return "50–249 employees";
    case "Large":
      return "250+ employees";
  }
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatSqft(n: number) {
  return `${formatNumber(n)} sq ft`;
}

/** Seeded content is dated up to this point; the clock never runs earlier. */
const SEED_HORIZON = new Date("2026-10-01T12:00:00Z").getTime();

export function timeAgo(iso: string, now: number = Math.max(Date.now(), SEED_HORIZON)) {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return minutes <= 1 ? "just now" : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function pluralize(n: number, singular: string, plural = `${singular}s`) {
  return `${formatNumber(n)} ${n === 1 ? singular : plural}`;
}
