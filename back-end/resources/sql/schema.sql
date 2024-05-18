-- Execute all SQL statements, in sequential order, from the top of this file
-- to create the tables or to "reset" the database to the expected structure


-- TODO: add your tables structure

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks
(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    name                    TEXT NOT NULL,
    description             TEXT,
    due_date                DATE,
    due_time                TIME,
    status                  TEXT NOT NULL
);