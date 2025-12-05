import Dexie, { type EntityTable } from "dexie";

type Bookmark = {
  id: string;
  url: string;
  title?: string;
};

type QuedBookmark = {
  id: string;
  url: string;
};

class Database extends Dexie {
  bookmarks!: EntityTable<Bookmark, "id">;
  queue!: EntityTable<QuedBookmark, "id">;

  constructor() {
    super("BookmarksDB");
  }
}

export const db = new Database();

db.version(1).stores({
  bookmarks: "++id",
  queue: "++id",
});
