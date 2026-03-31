export type Category =
  | "tops"
  | "bottoms"
  | "dresses"
  | "outerwear"
  | "shoes"
  | "accessories"
  | "other";

export interface ClothingItem {
  id: string;
  imageUri: string;       // local file URI (background-removed PNG)
  originalUri: string;    // original photo before processing
  name: string;
  category: Category;
  color: string;          // dominant colour tag e.g. "black"
  tags: string[];         // e.g. ["casual","summer"]
  brand?: string;
  createdAt: number;      // Unix ms
}

export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];      // references to ClothingItem.id
  createdAt: number;
  lastWorn?: number;
}

export type SortOrder = "newest" | "oldest" | "name";
