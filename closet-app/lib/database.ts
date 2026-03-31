import * as SQLite from "expo-sqlite";
import type { ClothingItem, Outfit } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("closet.db");
  }
  return db;
}

export async function initDB(): Promise<void> {
  const db = await getDB();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS clothing_items (
      id TEXT PRIMARY KEY,
      imageUri TEXT NOT NULL,
      originalUri TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      color TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      brand TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS outfits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      itemIds TEXT NOT NULL DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      lastWorn INTEGER
    );
  `);
}

// ── Clothing Items ──────────────────────────────────────────────────────────

export async function saveItem(item: ClothingItem): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT OR REPLACE INTO clothing_items
     (id, imageUri, originalUri, name, category, color, tags, brand, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    item.id,
    item.imageUri,
    item.originalUri,
    item.name,
    item.category,
    item.color,
    JSON.stringify(item.tags),
    item.brand ?? null,
    item.createdAt
  );
}

export async function loadItems(): Promise<ClothingItem[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM clothing_items ORDER BY createdAt DESC"
  );
  return rows.map(rowToItem);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  await db.runAsync("DELETE FROM clothing_items WHERE id = ?", id);
}

// ── Outfits ─────────────────────────────────────────────────────────────────

export async function saveOutfit(outfit: Outfit): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT OR REPLACE INTO outfits
     (id, name, itemIds, createdAt, lastWorn)
     VALUES (?, ?, ?, ?, ?)`,
    outfit.id,
    outfit.name,
    JSON.stringify(outfit.itemIds),
    outfit.createdAt,
    outfit.lastWorn ?? null
  );
}

export async function loadOutfits(): Promise<Outfit[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM outfits ORDER BY createdAt DESC"
  );
  return rows.map(rowToOutfit);
}

export async function deleteOutfit(id: string): Promise<void> {
  const db = await getDB();
  await db.runAsync("DELETE FROM outfits WHERE id = ?", id);
}

// ── Row mappers ─────────────────────────────────────────────────────────────

function rowToItem(row: Record<string, unknown>): ClothingItem {
  return {
    id: row.id as string,
    imageUri: row.imageUri as string,
    originalUri: row.originalUri as string,
    name: row.name as string,
    category: row.category as ClothingItem["category"],
    color: row.color as string,
    tags: JSON.parse(row.tags as string),
    brand: (row.brand as string | null) ?? undefined,
    createdAt: row.createdAt as number,
  };
}

function rowToOutfit(row: Record<string, unknown>): Outfit {
  return {
    id: row.id as string,
    name: row.name as string,
    itemIds: JSON.parse(row.itemIds as string),
    createdAt: row.createdAt as number,
    lastWorn: (row.lastWorn as number | null) ?? undefined,
  };
}
