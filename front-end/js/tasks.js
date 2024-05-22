// Global constants and variables
const addTaskBtn = document.getElementById("add-task-button");
const inputField = document.getElementById("task-input-field");

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function() {
    console.log("page loaded");
    console.log(addTaskBtn);
    console.log(inputField);
    addTaskBtn.addEventListener("click", openForm);
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            openForm();
        }
    });
});

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
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error(error);
        popup.alert("Error: " + error.message);
    }
}