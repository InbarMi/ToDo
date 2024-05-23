let express = require('express');
let router = express.Router();
const db = require("./../db");

/**
 * POST route
 */
router.post("/add_task",async function(req,res) {
    try {
        const taskName = req.body.task_name;
        const taskDescription = req.body.description;
        const dueDate = req.body.due_date;
        const dueTime = req.body.due_time;
        const status = req.body.status;


        let newTask = {
            task_name: taskName,
            description: taskDescription,
            due_date: dueDate,
            due_time: dueTime,
            status: status
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

module.exports = router;