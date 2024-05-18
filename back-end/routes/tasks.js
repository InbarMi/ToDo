let express = require('express');
let router = express.Router();
const db = require("./../db");

/**
 * POST route
 */
router.post("/add-task",async function(req,res) {
    const { 'task-name': taskName, 'task-description': taskDescription, 'due-date': dueDate, 'due-time': dueTime, 'status': status } = req.body;
    console.log("Received data:", req.body);
    try {
        const result = await db.insertNewTask(taskName, taskDescription, dueDate, dueTime, status);
        res.status(201).send();
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).send({message: "Internal Server Error", error: error.message});
    }
});

module.exports = router;