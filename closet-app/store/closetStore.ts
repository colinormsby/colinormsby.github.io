import { create } from "zustand";
import type { Category, ClothingItem, Outfit, SortOrder } from "../types";

interface ClosetState {
  items: ClothingItem[];
  outfits: Outfit[];
  selectedCategory: Category | "all";
  sortOrder: SortOrder;
  searchQuery: string;

  // Item actions
  addItem: (item: ClothingItem) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;

  // Outfit actions
  addOutfit: (outfit: Outfit) => void;
  updateOutfit: (id: string, updates: Partial<Outfit>) => void;
  removeOutfit: (id: string) => void;

  // Filter/sort
  setCategory: (category: Category | "all") => void;
  setSortOrder: (order: SortOrder) => void;
  setSearchQuery: (query: string) => void;

  // Hydrate from DB
  hydrate: (items: ClothingItem[], outfits: Outfit[]) => void;

  // Derived
  filteredItems: () => ClothingItem[];
}

export const useClosetStore = create<ClosetState>((set, get) => ({
  items: [],
  outfits: [],
  selectedCategory: "all",
  sortOrder: "newest",
  searchQuery: "",

  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),

  updateItem: (id, updates) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  removeItem: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      outfits: s.outfits.map((o) => ({
        ...o,
        itemIds: o.itemIds.filter((iid) => iid !== id),
      })),
    })),

  addOutfit: (outfit) => set((s) => ({ outfits: [outfit, ...s.outfits] })),

  updateOutfit: (id, updates) =>
    set((s) => ({
      outfits: s.outfits.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  removeOutfit: (id) =>
    set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) })),

  setCategory: (category) => set({ selectedCategory: category }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  hydrate: (items, outfits) => set({ items, outfits }),

  filteredItems: () => {
    const { items, selectedCategory, sortOrder, searchQuery } = get();
    let result = [...items];

    if (selectedCategory !== "all") {
      result = result.filter((i) => i.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.color.toLowerCase().includes(q) ||
          i.brand?.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return b.createdAt - a.createdAt;
      if (sortOrder === "oldest") return a.createdAt - b.createdAt;
      return a.name.localeCompare(b.name);
    });

    return result;
  },
}));
