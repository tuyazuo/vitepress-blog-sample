-- npx wrangler d1 execute [database] --remote --file=./schema.sql


DROP TABLE IF EXISTS comment;
CREATE TABLE IF NOT EXISTS comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    nick TEXT NOT NULL,
    email TEXT NOT NULL,
    body TEXT NOT NULL,
    site TEXT,
    time INTEGER NOT NULL
);
CREATE INDEX idx_url ON comment (url);
CREATE INDEX idx_time ON comment (time);