-- Execute all SQL statements, in sequential order, from the top of this file
-- to create the tables or to "reset" the database to the expected structure


-- TODO: add your tables structure

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks
(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    name                    VARCHAR(30),
    description             VARCHAR(50),
    due_date                DATE,
    due_time                TIME,
    status                  VARCHAR(20)
);

DROP TABLE IF EXISTS subtasks;

CREATE TABLE subtasks
(
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    main_task               INTEGER,
    name                    VARCHAR(30),
    description             VARCHAR(50),
    due_date                DATE,
    due_time                TIME,
    status                  VARCHAR(20),
    FOREIGN KEY (main_task) REFERENCES tasks(id)
);