import Dexie, { type EntityTable } from "dexie";

type Bookmark = {
  id: string;
  url: string;
  title?: string;
  meta?: object;
};

class Database extends Dexie {
  bookmarks!: EntityTable<Bookmark, "id">;

  constructor() {
    super("BookmarksDB");
  }
}

export const db = new Database();

db.version(2).stores({
  bookmarks: "++id",
});
