import { db } from "./db";
import { notes, history, type InsertNote, type InsertHistory, type Note, type HistoryItem } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  deleteNote(id: number): Promise<void>;
  
  getHistory(): Promise<HistoryItem[]>;
  addToHistory(item: InsertHistory): Promise<HistoryItem>;
  clearHistory(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  async getHistory(): Promise<HistoryItem[]> {
    return await db.select().from(history).orderBy(desc(history.createdAt)).limit(100);
  }

  async addToHistory(item: InsertHistory): Promise<HistoryItem> {
    const [newItem] = await db.insert(history).values(item).returning();
    return newItem;
  }

  async clearHistory(): Promise<void> {
    await db.delete(history);
  }
}

export const storage = new DatabaseStorage();
