import { DatabaseSync } from "node:sqlite"

export const db = new DatabaseSync("data/data.sqlite");

db.exec("PRAGMA journal_mode = wal;") // Different implementation of the atomicity properties
db.exec("PRAGMA synchronous = normal;") // Synchronize less often to the filesystem since we have WAL
db.exec("PRAGMA foreign_keys = on;") // Check foreign key reference, slightly worst performance
db.exec("PRAGMA cache_size = 1000000000;") // Large cache since this is a server
db.exec("PRAGMA temp_store = memory;") // In RAM for speed

process.on("exit", () => {
	db.exec("PRAGMA analysis_limit=400;");
	db.exec("PRAGMA optimize;");
});
