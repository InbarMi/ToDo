/* File: back-end/routes/tasks.js
 * Description: This file organizes all routes for task management
 * Author: Inbar Milstein
 * Date: Summer 2024
 */

// setup and imports
let express = require('express');
let router = express.Router();
const db = require("./../db");

/**
 * POST  /add_task
 * Adds a new task to the database. Expects task details in the request body
 */
router.post("/add_task",async function(req,res) {
    try {
        const taskName = req.body.task_name;
        const taskDescription = req.body.task_description;
        const dueDate = req.body.due_date;
        const dueTime = req.body.due_time;
        const status = req.body.task_status;


        let newTask = {
            task_name: taskName,
            task_description: taskDescription,
            due_date: dueDate,
            due_time: dueTime,
            task_status: status
        };

        console.log(newTask);

        newTask = await db.insertNewTask(newTask);

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error:", error);
        res.status(422).json({"error": "failed to add new task to the database"});
    }
});

/**
 * GET /tasks
 * Retrieves all tasks from the database
 */
router.get("/tasks", async function(req, res) {
    try {
        console.log("awaiting on listOfTasks from db.js")
        const listOfTasks = await db.getAllTasks();
        console.log("listOfTasks:", listOfTasks);

        res.send(listOfTasks);
    }
    catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({"error": "Internal Server Error" });
    }
});

/**
 * GET tasks/:tasksID
 * Retrieves a specific task by its ID
 */
router.get("/tasks/:taskID", async function(req, res) {
    const taskID = req.params.taskID;
    try {
        console.log(`awaiting on task from db.js`);
        const task = await db.getTaskById(taskID);

        if (task) {
            res.send(task);
        } else {
            res.status(404).json({error: "Task not found"});
        }
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * UPDATE /update_task/:task_id
 * Updates an existing task by its ID. Expects updated task details in the request body
 */
router.put("/update_task/:task_id", async function(req, res) {
    const taskName = req.body.task_name;
    const taskDescription = req.body.task_description;
    const dueDate = req.body.due_date;
    const dueTime = req.body.due_time;
    const taskStatus = req.body.task_status;
    const taskID = req.params.task_id;

    try {
        console.log("Received updated data:", {
            taskName,
            taskDescription,
            dueDate,
            dueTime,
            taskStatus,
            taskID
        });
        const result = await db.updateTask(taskID, taskName, taskDescription, dueDate, dueTime, taskStatus);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error updating task with id: ${taskID}: `, error);
        res.status(500).json({"error": "Internal Server Error"});
    }
});

module.exports = router;