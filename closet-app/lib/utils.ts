import type { Category } from "../types";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Tops", value: "tops" },
  { label: "Bottoms", value: "bottoms" },
  { label: "Dresses", value: "dresses" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessories", value: "accessories" },
  { label: "Other", value: "other" },
];

export const CATEGORY_ICONS: Record<Category | "all", string> = {
  all: "layers-outline",
  tops: "shirt-outline",
  bottoms: "body-outline",
  dresses: "woman-outline",
  outerwear: "cloudy-outline",
  shoes: "footsteps-outline",
  accessories: "watch-outline",
  other: "ellipsis-horizontal-outline",
};
