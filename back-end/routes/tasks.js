let express = require('express');
let router = express.Router();
const db = require("./../db");
const {query} = require("express");

/**
 * POST route
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
 * GET all tasks route
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
 * GET task by id
 */
router.get("/tasks/:taskID", async function(req, res) {
    try {
        console.log(`awaiting on task from db.js`);
        const task = await db.getTaskById(taskId);

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
 * UPDATE a single task
 */
router.put("/update_task/:task_id", async function(req, res) {
    const taskID = req.params.task_id;
    const updatedData = req.body;

    try {
        const result = await db.updateTask(taskID, updatedData);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error updating task with id: ${taskID}: `, error);
        res.status(500).json({"error": "Internal Server Error"});
    }
});

module.exports = router;