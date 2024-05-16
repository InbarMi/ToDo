/**
 * Add task to task board
 */
function addTask(event) {
    // Prevent default submission (prevent reloading)
    event.preventDefault();

    // new popup window
    var popup = window.open("", "Add Task Form", "width=600,height=400,scrollbars=no,resizable=no");

    // content for the window
    var htmlContent = `
        <html>
        <head>
            <title>Add Task Form</title>
        </head>
        <body>
            <h1>Add New Task</h1>
                <form id="task-form">
                    <input type="text" id="task-name" name="task-name" required>
                    <label for="task-name">Task Name:</label>

                    <input type="text" id="task-description" name="task-description">
                    <label for="task-description">Task Description</label>

                    <input type="date" id="due-date" name="due-date">
                    <label for="due-date">Due Date</label>

                    <input type="time" id="due-time" name="due-time">
                    <label for="due-time">Due Time</label>

                    <select id="status" name="status" required>
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="complete">Complete</option>
                    </select>

                    <button type="submit">Add Task To Board</button>
                </form>
            <button onclick="window.close();">Close</button>
        </body>
        </html>
    `;

    popup.document.write(htmlContent);

    // close popup when task is submitted
    popup.document.getElementById('taskForm').onsubmit = function() {
        popup.close();
        return false; // Prevent the form from submitting in a traditional way
    };
}