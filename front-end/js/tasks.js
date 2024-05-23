// Global constants and variables
const addTaskBtn = document.getElementById("add-task-button");
const inputField = document.getElementById("task-input-field");

// Initialize event listeners
document.addEventListener("DOMContentLoaded", async function() {
    console.log("page loaded");
    await fetchTasksAndDisplay();
    addTaskBtn.addEventListener("click", openForm);
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            openForm();
        }
    });
});

/**
 * Open popup to enter new task info
 */
async function openForm() {
    const taskName = inputField.value;

    try {
        // get popupForm.html content
        const response = await fetch('./popupForm.html');
        if (!response.ok) {
            throw new Error('Network response failure ' + response.statusText);
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
            throw new Error('Failed to submit form');
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
        console.log("Awaiting response")
        const response = await fetch(API_URL);
        console.log("received response")

        if (response.ok)
        {
            const listOfTasksAsJSON = await response.json();
            console.log("Successfully fetched tasks data.")

            displayTasks(listOfTasksAsJSON);
        }
        else
        {
            throw new Error("failed to fetch task data.")
        }
    }
    catch (error)
    {
        console.error(error);
    }
}

// /**
//  * Display all tasks in the task board
//  * @param listOfTasks JSON list of tasks
//  */
function displayTasks(listOfTasks) {
    // get list containers
    const todoList = document.getElementById("todoList").querySelector(".scroll");
    const inProgressList = document.getElementById("inprogressList").querySelector(".scroll");
    const completeList = document.getElementById("completeList").querySelector(".scroll");

    // clear lists to avoid duplicates
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    completeList.innerHTML = "";

    // iterate through list of tasks
    listOfTasks.forEach(task => {
        const taskID = task.id;
        const taskName = task.name;
        const taskDueDate = task.due_date;
        const taskStatus = task.status;

        // create new li element for each task
        const newTaskItem = document.createElement("li");
        newTaskItem.setAttribute("data-task-id", taskID);

        // span element for task name
        const taskNameElement = document.createElement("span");
        taskNameElement.className = "task_name";
        taskNameElement.textContent = taskName;
        newTaskItem.appendChild(taskNameElement);

        // append li element to appropriate status column
        switch (taskStatus) {
            case "todo":
                todoList.appendChild(newTaskItem);
                break;
            case "inprogress":
                inProgressList.appendChild(newTaskItem);
                break;
            case "complete":
                completeList.appendChild(newTaskItem);
                break;
        }

        // set up event listeners for tasks
        // newTaskItem.addEventListener("mouseover", () => {
        //     showTaskDetails(taskID);
        // });
        //
        // newTaskItem.addEventListener("click", () => {
        //     editTaskDetails(taskID);
        // });
    });
}

function showTaskDetails(taskID) {

}