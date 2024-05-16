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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="../../front-end/css/styles.css">
            <title>Add Task Form</title>
        </head>
        <body>
            <h1>Add New Task</h1>
                <form id="task-form">
                    <div class="input">
                        <label for="task-name">Task Name</label>
                        <input type="text" id="task-name" name="task-name" required>
                    </div>
                    
                    <div class="input">
                        <label for="task-description">Task Description</label>
                        <textarea id="task-description" name="task-description" rows="4" cols="50"></textarea>                        
                    </div>

                    <div class="input">
                        <label for="due-date">Due Date</label>
                        <input type="date" id="due-date" name="due-date">                        
                    </div>

                    <div class="input">
                        <label for="due-time">Due Time</label>
                        <input type="time" id="due-time" name="due-time">
                    </div>

                    <div class="input">
                        <label for="status">Status</label>
                        <select id="status" name="status" required>
                            <option value="todo">To Do</option>
                            <option value="inprogress">In Progress</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>

                    <button type="submit" id="submit-task-button">Add Task To Board</button>
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