-- -- Execute all SQL statements, in sequential order, from the top of this file
-- -- to create the tables or to "reset" the database to the expected structure
--
--
-- -- add your tables structure
--
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks
(
    task_id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name               TEXT NOT NULL,
    task_description        TEXT,
    due_date                DATE,
    due_time                TIME,
    task_status             TEXT NOT NULL
);