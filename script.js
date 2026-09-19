const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-value]");

const clearButton = document.getElementById("clearButton");
const deleteButton = document.getElementById("deleteButton");
const calculateButton = document.getElementById("calculateButton");

const themeButton = document.getElementById("themeButton");

const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");


// ===============================
// Number and Operator Buttons
// ===============================

numberButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const value = button.getAttribute("data-value");

        // If display contains Error, clear it
        if (display.value === "Error") {
            display.value = "";
        }

        // If display is 0 and user enters a number
        if (display.value === "0" && value !== ".") {
            display.value = value;
        } 
        else {
            display.value += value;
        }

    });

});


// ===============================
// CLEAR BUTTON
// ===============================

clearButton.addEventListener("click", function() {

    display.value = "0";

});


// ===============================
// DELETE BUTTON
// ===============================

deleteButton.addEventListener("click", function() {

    if (
        display.value === "Error" ||
        display.value.length <= 1
    ) {
        display.value = "0";
    }
    else {
        display.value = display.value.slice(0, -1);
    }

});


// ===============================
// CALCULATE BUTTON
// ===============================

calculateButton.addEventListener("click", function() {

    calculate();

});


function calculate() {

    let expression = display.value;

    // Empty input
    if (expression === "" || expression === "0") {
        return;
    }

    try {

        // Check invalid characters
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid characters");
        }

        // Check division by zero
        if (/\/0(?![0-9])/.test(expression)) {
            throw new Error("Division by zero");
        }

        // Convert percentage
        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        // Check result
        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        // Save calculation
        addHistory(display.value, result);

        // Show result
        display.value = result;

    }
    catch (error) {

        display.value = "Error";

        setTimeout(function() {
            display.value = "0";
        }, 1000);

    }

}


// ===============================
// KEYBOARD SUPPORT
// ===============================

document.addEventListener("keydown", function(event) {

    const key = event.key;

    // Numbers and operators
    if (/^[0-9+\-*/%.]$/.test(key)) {

        if (display.value === "Error") {
            display.value = "";
        }

        if (display.value === "0" && key !== ".") {
            display.value = key;
        }
        else {
            display.value += key;
        }

    }

    // Enter
    else if (key === "Enter") {

        event.preventDefault();

        calculate();

    }

    // Backspace
    else if (key === "Backspace") {

        if (
            display.value === "Error" ||
            display.value.length <= 1
        ) {
            display.value = "0";
        }
        else {
            display.value = display.value.slice(0, -1);
        }

    }

    // Escape
    else if (key === "Escape") {

        display.value = "0";

    }

});


// ===============================
// HISTORY
// ===============================

function addHistory(expression, result) {

    const listItem = document.createElement("li");

    listItem.textContent =
        expression + " = " + result;

    historyList.prepend(listItem);

    saveHistory();

}


function saveHistory() {

    localStorage.setItem(
        "calculatorHistory",
        historyList.innerHTML
    );

}


function loadHistory() {

    const savedHistory =
        localStorage.getItem("calculatorHistory");

    if (savedHistory) {

        historyList.innerHTML = savedHistory;

    }

}


// Clear History

clearHistoryButton.addEventListener("click", function() {

    historyList.innerHTML = "";

    localStorage.removeItem("calculatorHistory");

});


// ===============================
// DARK MODE
// ===============================

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

        localStorage.setItem(
            "theme",
            "dark"
        );

    }
    else {

        themeButton.textContent = "🌙";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});


function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeButton.textContent = "☀️";

    }

}


// ===============================
// START APPLICATION
// ===============================

loadHistory();

loadTheme();