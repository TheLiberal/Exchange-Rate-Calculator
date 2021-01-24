"use strict";

// Clear inputs on window's load
window.onload = function () {
    document.querySelector(".currency-value-input").value = null;
    document.querySelector(".currency-value-output").value = null;
};


// Create new http object for calling API
const http = new HTTP;

// Chosen currencies inputs
const inputSelect = document.querySelector(".currency-options-input");
const outputSelect = document.querySelector(".currency-options-output");

// Value of chosen currencies
let firstChosenCurrency = inputSelect.value;
let secondChosenCurrency = outputSelect.value;

// Variable for currency rate which is updated on currency type input
let currencyRate;


// API call to populate currencies options dropdowns
http.get("https://v6.exchangerate-api.com/v6/8aedd0d17742ce47433060d1/latest/USD")
    .then(data => {
        for (let key in data.conversion_rates) {
            if (key === "USD") continue;
            // Add currencies to html
            inputSelect.innerHTML += `<option value="${key}">${key}</option>`;
            outputSelect.innerHTML += `<option value="${key}">${key}</option>`;
        }
        // Unlock inputs to choose currencies
        inputSelect.removeAttribute("disabled");
        outputSelect.removeAttribute("disabled");
    })
    .catch(err => console.log(err));


// Input currency select
// Output value update on currency change
inputSelect.addEventListener("input", (event) => {
    event.preventDefault();

    // Sets a variable to input's value
    firstChosenCurrency = inputSelect.value;
    // Calls api for chosen currency's rates
    http.get(`https://v6.exchangerate-api.com/v6/8aedd0d17742ce47433060d1/latest/${firstChosenCurrency}`)
        .then(data => {
            // Search for second currency
            for (let key in data.conversion_rates) {
                if (key === secondChosenCurrency) {
                    currencyRate = data.conversion_rates[key];
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    calculateExchangeValue(event);
});


// Output currency select
// Output value update on currency change
outputSelect.addEventListener("input", (event) => {
    event.preventDefault();

    // Sets a variable to output's value
    secondChosenCurrency = outputSelect.value;

    // Calls api for chosen currency's rates
    http.get(`https://v6.exchangerate-api.com/v6/8aedd0d17742ce47433060d1/latest/${firstChosenCurrency}`)
        .then(data => {
            // Search for second currency
            for (let key in data.conversion_rates) {
                if (key === secondChosenCurrency) {
                    currencyRate = data.conversion_rates[key];
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    calculateExchangeValue(event);
});


// Event listener for calculation on key up action
document.querySelector(".currency-value-input").addEventListener("keyup", calculateExchangeValue);


// Allows only numbers, dots and commas in the value input
setInputFilter(document.querySelector(".currency-value-input"), function (value) {
    return /^-?\d*[.,]?\d{0,2}$/.test(value);
});


// Function for calculating output value of currency exchange
function calculateExchangeValue(event) {
    event.preventDefault();
    let exchangedValue = document.querySelector(".currency-value-input").value * currencyRate;
    exchangedValue = exchangedValue.toFixed(2);
    document.querySelector(".currency-value-output").value = exchangedValue;
}

// Function for restricting input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}