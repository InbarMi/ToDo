const fs = require("fs");
const util = require("util");
const sqlite3 = require('sqlite3').verbose();

const SQLITE_FILE_NAME = "todo.sqlite";
let db;

// If the run environment is 'test', we create an ephemeral (in memory) SQLite database that will
//   - create tables using the structure defined in the schema file: './resources/sql/schema.sql'
//   - populate the tables with data from the seeds file: './resources/sql/seeds.sql'
// Once the tests complete (i.e., finish running), this in memory SQLite database will be deleted automatically
//
// However, if the environment is not 'test' (e.g., the environment is 'development') then the application will use
// the SQLite database specified in the SQLITE_FILE_NAME
if (process.env.NODE_ENV === "test")
{
    console.log("Creating an in memory SQLite database for running the test suite...");

    const contentOfSchemaSQLFile = fs.readFileSync("./resources/sql/schema.sql", "utf8");
    const contentOfSeedsSQLFile = fs.readFileSync("./resources/sql/seeds.sql", "utf8");

    // Creates a connection to an in-memory SQLite database
    db = new sqlite3.Database(":memory:", function(err)
    {
        if (err)
        {
            return console.error(err.message);
        }

        // Enable enforcement of foreign keys constraints in the SQLite database every time we run the tests
        db.get("PRAGMA foreign_keys = ON;");

        console.log(`Connected to the ':memory:' SQLite database.`);
        console.log("Creating the tables from the 'schema.sql' file...");
        console.log("Populating them with data from the 'seeds.sql' file...");
        db.serialize(function()
        {
            // the serialize method ensures that the SQL queries from the exec calls are executed sequentially
            // (i.e., one after the other instead of being executed in parallel)
            db.exec(contentOfSchemaSQLFile);
            db.exec(contentOfSeedsSQLFile);
        });
    });
}
else
{
    // This is the default environment (e.g., 'development')

    // Create a connection to the SQLite database file specified in SQLITE_FILE_NAME
    db = new sqlite3.Database("./" + SQLITE_FILE_NAME, function(err)
    {
        if (err)
        {
            return console.error(err.message);
        }

        // Enable enforcement of foreign keys constraints in the SQLite database every time we start the application
        db.get("PRAGMA foreign_keys = ON;");

        let stmt = `
                CREATE TABLE IF NOT EXISTS tasks
                (
                    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
                    name                    VARCHAR(30) NOT NULL,
                    description             VARCHAR(100),
                    due_date                DATE,
                    due_time                TIME,
                    status                  VARCHAR(20) NOT NULL
                );`;

        db.run(stmt, function (err){
            if (err) {
                return console.error("Error creating tasks table:", err.message);
            }
            console.log(`Connected to the '${SQLITE_FILE_NAME}' SQLite database for development.`);
        });
    });
}

/**
 *
 */
async function insertNewTask(newTask) {
    return new Promise(function (resolve, reject) {
        db.serialize(function () {
            db.run("BEGIN TRANSACTION;");

            const sql =
                `INSERT INTO tasks (name, description, due_date, due_time, status)
                 VALUES (?, ?, ?, ?, ?);`;

            function callbackAfterReturnedRowIsProcessed(err, row) {
                console.log("callbackAfterReturnedRowIsProcessed - START");
                if (err) {
                    reject(err);
                }

                const numberOfRowsAffected = this.changes;
                if (numberOfRowsAffected > 0) {
                    const generatedIdForTheNewlyInsertedTask = this.lastID;

                    console.log("SUCESSFULLY inserted a new task with id = " + generatedIdForTheNewlyInsertedTask);
                    newTask.id = generatedIdForTheNewlyInsertedTask;

                    db.run("COMMIT;", function(commitErr) {
                        if (commitErr) {
                            reject(commitErr);
                        } else {
                            resolve(newTask);
                        }
                    });
                }
            }
            db.run(sql, [newTask.task_name, newTask.task_description, newTask.due_date, newTask.due_time, newTask.status],
                callbackAfterReturnedRowIsProcessed);
        });
    });
}

async function getAllTasks() {
    return new Promise(function(resolve, reject) {
        db.serialize(function() {
            db.run("BEGIN TRANSACTION");

            const sql = `SELECT * FROM tasks;`;
            let listOfTasks = [];

            const callbackToProcessEachRow = function(err, row) {
                if (err) {
                    reject(err);
                }

                const id = row.id;
                const name = row.name;
                const description = row.description;
                const due_date = row.due_date;
                const due_time = row.due_time;
                const status = row.status;

                const currentRowTask = {
                    id: id,
                    name: name,
                    description: description,
                    due_date: due_date,
                    due_time: due_time,
                    status: status
                };

                listOfTasks.push(currentRowTask);
            };

            const callbackAfterAllRowsAreProcessed = function() {
                resolve(listOfTasks);
            };

            db.each(sql, callbackToProcessEachRow, callbackAfterAllRowsAreProcessed);
        });
    });
}

// these functions will be available from other files that import this module
module.exports = {
    insertNewTask,
    getAllTasks,
};
