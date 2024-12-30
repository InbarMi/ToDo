/* File: front-end/js/tasks.js
 * Description:
 * Author: Inbar Milstein
 * Date: Summer 2024
 */
// Global constants and variables
const inputField = document.getElementById("task-input-field");

// Initialize event listeners

// Load all tasks on page loading
document.addEventListener("DOMContentLoaded", async function() {
    console.log("page loaded");

    const addTaskBtn = document.getElementById("add-task-button");
    const clearToDoBtn = document.getElementById("clearToDoListBtn");
    const clearInProgressBtn = document.getElementById("clearInProgressBtn");
    const clearCompleteBtn = document.getElementById("clearCompleteBtn");

    await fetchTasksAndDisplay();
    // Display new task form on click of addTask button or on keyboard "Enter" from task input field
    addTaskBtn.addEventListener("click", openForm);
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            openForm();
        }
    });
    clearToDoBtn.addEventListener("click", () => {clearList("todo");});
    clearInProgressBtn.addEventListener("click", () => {clearList("inprogress");});
    clearCompleteBtn.addEventListener("click", () => {clearList("complete");});
});

/**
 * Display popup form for adding a new task
 */
async function openForm() {
    // get task name if provided
    const taskName = inputField.value;

    try {
        // get popupForm.html content
        const response = await fetch('./popupForm.html');
        if (!response.ok) {
            console.error('Network response failure ' + response.statusText);
        }
        let htmlContent = await response.text();

        // open new pop-up window
        let popup = window.open("", "Add Task Form", "width=600,height=400,scroll=no,resizable=no");

        // write html content to the pop-up
        popup.document.open();
        popup.document.write(htmlContent);
        popup.document.close();

        // set task name value
        popup.onload = () => {
            if (taskName !== "") {
                popup.document.getElementById('task_name').setAttribute('value', taskName);
            }

            const taskForm = popup.document.getElementById("task-form");
            if (taskForm) {
                taskForm.addEventListener("submit", function (event) {
                    event.preventDefault();

                    const formData = new FormData(this);
                    addNewTask(formData, popup);
                });
            } else {
                console.error("Failed to fetch the popup form");
            }
        }
    } catch (error) {
        console.error('Failed to fetch the popup form:', error);
    }
}

/**
 * Send POST request to router to add new task to the database and task board
 * @param taskData to create new task object from
 * @param popup page with task info to enter
 */
async function addNewTask(taskData, popup) {
    const API_URL = 'http://localhost:8080/add_task';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(taskData)
        });

        if (response.ok) {
            popup.close();
            await fetchTasksAndDisplay();
        } else {
            console.error('Failed to submit form');
        }
    } catch (error) {
        console.error(error);
        popup.alert("Error: " + error.message);
    }
}

// /**
//  * Get all tasks from the table in database and process for display
//  */
async function fetchTasksAndDisplay() {
    const API_URL = "http://localhost:8080/tasks";

    try
    {
        console.log("Awaiting response");
        const response = await fetch(API_URL);
        console.log("received response");

        if (response.ok)
        {
            const listOfTasksAsJSON = await response.json();
            console.log("Successfully fetched tasks data.");

            displayTasks(listOfTasksAsJSON);
            console.log("finished displaying tasks on board");
        }
        else
        {
            console.error("failed to fetch task data.")
        }
    }
    catch (error)
    {
        console.error(error);
    }
}

/**
 * Display all tasks in the task board
 * @param listOfTasks JSON list of tasks
 */
function displayTasks(listOfTasks) {
    // get list containers
    const todoList = document.getElementById("todoList").querySelector(".scroll");
    const inProgressList = document.getElementById("inprogressList").querySelector(".scroll");
    const completeList = document.getElementById("completeList").querySelector(".scroll");

    console.log(todoList);
    console.log(inProgressList);
    console.log(completeList);

    // clear lists to avoid duplicates
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    completeList.innerHTML = "";

    // iterate through list of tasks
    listOfTasks.forEach(task => {
        const taskID = task.task_id;
        const taskStatus = task.task_status;

        // create new li element for each task
        const newTaskItem = document.createElement("li");
        newTaskItem.setAttribute("class", "task-item")
        newTaskItem.setAttribute("data-task-id", taskID);

        setTaskItemDetails(newTaskItem, task);

        // append li element to appropriate status column
        switch (taskStatus) {
            case "todo":
                todoList.appendChild(newTaskItem);
                console.log(`${newTaskItem} successfully appended to todo column`);
                break;
            case "inprogress":
                inProgressList.appendChild(newTaskItem);
                break;
            case "complete":
                completeList.appendChild(newTaskItem);
                break;
        }

        const expandArrow = newTaskItem.querySelector(".expand-arrow");
        expandArrow.addEventListener("click", () => {
            newTaskItem.classList.toggle("expanded");
            expandArrow.textContent = newTaskItem.classList.contains('expanded') ? '▲' : '▼';
        });

        const deleteTaskBtn = newTaskItem.querySelector(".delete-task");
        deleteTaskBtn.addEventListener("click", () => { deleteTask(taskID);
        });

        const editBtn = newTaskItem.querySelector(".edit-button");
        editBtn.addEventListener("click", () => {
            openEditForm(taskID)
                .then(() => {
                    console.log("Edit form opened successfully");
                })
                .catch((error) => {
                    console.error("Error opening edit form:", error);
                });
        });

    });
}

function setTaskItemDetails(taskElement, task) {
    const taskName = task.task_name;
    const taskDescription = task.task_description;
    const dueDate = task.due_date;
    const dueTime = task.due_time;

    let taskElementHTML = `
            <div class="task-summary">
                <p class="task-name">${taskName}</p>
                <button class="expand-arrow">▼</button>
                <button class="delete-task">✖</button>
            </div>
            <div class="task-details">
            <hr>`;

    if (taskDescription) {
        taskElementHTML += `<p><b>Description:</b> ${taskDescription}</span><br>`;
    }
    if (dueDate) {
        taskElementHTML += `<b>Due Date:</b> ${dueDate}<br>`;
    }
    if (dueTime) {
        taskElementHTML += `<b>Due Time:</b> ${dueTime}<br>`;
    }
    taskElementHTML += `</p><br>`;
    taskElementHTML += '<button class="edit-button">Edit</button>';
    taskElementHTML += `</div>`;

    taskElement.innerHTML = taskElementHTML;
}

/**
 * Open popup to edit existing task info
 */
async function openEditForm(taskID) {

    try {
        // get editForm.html content
        const response = await fetch('./editForm.html');
        if (!response.ok) {
            console.error('Network response failure ' + response.statusText);
        }
        let htmlContent = await response.text();

        // open new pop-up window
        let popup = window.open("", "Edit Task Form", "width=600,height=400,scroll=no,resizable=no");

        // write html content to the pop-up
        popup.document.open();
        popup.document.write(htmlContent);
        popup.document.close();

        // populate fields with existing data
        popup.onload = async () => {
            try {
                const taskResponse = await fetch(`http://localhost:8080/tasks/${taskID}`);
                if (!taskResponse.ok) {
                    console.error('Failed to fetch task data ' + taskResponse.statusText);
                }
                const taskData = await taskResponse.json();

                // set form values
                popup.document.getElementById("task_name").value = taskData.task_name || '';
                popup.document.getElementById("task_description").value = taskData.task_description || '';
                popup.document.getElementById("task_status").value = taskData.task_status || '';
                popup.document.getElementById("due_date").value = taskData.due_date || '';
                popup.document.getElementById("due_time").value = taskData.due_time || '';

                const taskForm = popup.document.getElementById("edit-form");
                if (taskForm) {
                    taskForm.addEventListener("submit", async function (event) {
                        event.preventDefault();
                        const updatedData = new FormData(this);
                        console.log("Submitting updated data:", updatedData);

                        await updateTask(taskID, updatedData);
                        await fetchTasksAndDisplay();
                        popup.close();
                    });
                } else {
                    console.error("Failed to find the edit form");
                }
            } catch (error) {
                console.error("Failed to fetch task data:", error);
            }
        };
    } catch (error) {
        console.error('Failed to fetch the popup form:', error);
    }
}

async function updateTask(taskID, updatedData) {
    const API_URL = `http://localhost:8080/update_task/${taskID}`;
    console.log("updatedData: ", updatedData);

    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(updatedData)
        });

        if (!response.ok) {
            console.error("Failed to update task");
        }

        console.log(`Successfully updated task ${taskID}`);
    } catch (error) {
        console.error("Error updating task: ", error);
    }
}

async function deleteTask(taskId) {
    const API_URL = `http://localhost:8080/delete/id/${taskId}`;
    try {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error(`Failed to delete task with ID ${taskId}`);
        }

        console.log(`Successfully deleted task with ID ${taskId}`);

        await fetchTasksAndDisplay();
    } catch (error) {
        console.error(`Error deleting task with ID ${taskId}`);
    }
}

async function clearList(taskStatus) {
    const API_URL = `http://localhost:8080/delete/status/${taskStatus}`;
    console.log("Calling delete with status: ", taskStatus);
    try {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Failed to delete tasks");
        }

        console.log(`Successfully deleted ${taskStatus} tasks`);

        // refresh page
        await fetchTasksAndDisplay();
    } catch (error) {
        console.error("Error deleting tasks: ", error);
    }
}