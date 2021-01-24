"use strict";

// Create new http object for calling API
const http = new HTTP;

// Call API to get all available currencies
http.get("https://v6.exchangerate-api.com/v6/8aedd0d17742ce47433060d1/latest/USD")
    .then(data => {

        const availableCurrencies = data.conversion_rates;

        // Populate html grid with available currencies
        // Give each element flag class with an image
        for (let key in availableCurrencies) {
            document.querySelector(".list").innerHTML += `<li>
            <div class="currency-flag currency-flag-xl currency-flag-${key.toLowerCase()}"></div>
            <p class="currency-code">${key}</p>
        </li>`;
        }
    })
    .catch(err => {
        // Display error message on error
        let documentSection = document.querySelector(".list-of-currencies");
        documentSection.innerText = "Couldn't load available currencies. Please use the calculator or try again.";
        documentSection.style.marginTop = "4rem";
        documentSection.style.fontSize = "2rem";
        console.log(err);
    });