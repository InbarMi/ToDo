-- Execute all SQL INSERT statements, in sequential order, from the top of this file
-- to populate the tables with sample data

-- sample data
INSERT INTO tasks (task_name, task_description, due_date, due_time, task_status)
VALUES ('Test Task 1', 'Test Description 1', '2025-01-01', '10:00', 'todo'),
       ('Test Task 2', 'Test Description 2', '2025-01-02', '11:00', 'inprogress'),
       ('Test Task 3', 'Test Description 3', '2025-01-03', '12:00', 'complete');
