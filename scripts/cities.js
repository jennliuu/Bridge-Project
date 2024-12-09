// establishing a few global variables
const suggestionsContainer = document.getElementById("suggestions");
const citySearchInput = document.getElementById('city-search'); 
const cityResults = document.getElementById("city-results");
const chosenCitiesContainer = document.getElementById("city-chosen");
const selectionMessage = document.getElementById("selection-message");
const nextButton = document.querySelector('.next-btn');
const backButton = document.querySelector('.back-btn');

// manually adding a few suggestions for cities to choose
const manualSuggestions = [
    { name: "Chicago", countryName: "USA", latitude: "41.85003", longitude: "-87.65005" },
    { name: "Singapore", countryName: "Singapore", latitude: "1.36667", longitude: "103.8" },
    { name: "London", countryName: "UK", latitude: "51.50853", longitude: "-0.12574" },
    { name: "Taipei", countryName: "Taiwan", latitude: "25.05306", longitude: "121.52639" },
];

// setting a variable for the maximum number of cities that can be chosen
const MAX_CITIES = 2;
// making an empty array for the cities that will be selected later on
let selectedCities = [];

// function to update the state of the next button
function updateNextButtonState() {
    if (selectedCities.length === MAX_CITIES) { // only if the selected cities is 2 
        nextButton.disabled = false; // then don't disable the button 
        nextButton.classList.remove('disabled'); 
    } else {
        nextButton.disabled = true; // disable the button 
        nextButton.classList.add('disabled'); 
    }
}

// function to display the manually written suggestions
function displayManualSuggestions() {
    suggestionsContainer.innerHTML = ""; // emptying the container

    manualSuggestions.forEach((cityData) => { // iterating over each city in the array
        const cityDiv = document.createElement("div"); // creating a div for each suggestion
        cityDiv.className = "suggestion-item"; // creating a class for each suggestion
        cityDiv.textContent = `${cityData.name}, ${cityData.countryName}`; // what each suggested city would look like

        cityDiv.addEventListener("click", () => { // if a suggested city is clicked on
            addToChosenCities(cityData); // add the city to the chosen city function as well
        });

        suggestionsContainer.appendChild(cityDiv); // make the suggested city shown
    });
}

// adding an async function so it can start loading cities from the API
async function filterCities(event) {
    const query = citySearchInput.value.trim();

    // only show suggestions if there is more than 2 letters 
    if (query.length < 2) { 
        cityResults.style.display = "none"; // if it is less, then render nothing 
        return;
    }

    const url = `https://secure.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=jennliuu`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.geonames) {
        displayCities(data.geonames);
    }
}

// function to display the cities for the search bar
function displayCities(cities) {
    cityResults.innerHTML = ""; 
    if (cities.length > 0) { // to show if the cities exist
        cityResults.style.display = 'block'; // to show dropdown
    } else {
        cityResults.style.display = 'none'; // to hide dropdown
    }

    cities.forEach((cityData) => { // iterate over each city 
        const div = document.createElement("div");  // create a div 
        div.classList.add("result-item"); // create the class name 
        div.textContent = `${cityData.name}, ${cityData.countryName}`; // what it should look like 

        div.addEventListener("click", () => {  // if clicked on 
            addToChosenCities({  // save these things in an object 
                name: cityData.name, 
                countryName: cityData.countryName,
                latitude: cityData.lat,
                longitude: cityData.lng
            });
            cityResults.style.display = "none"; 
            citySearchInput.value = ""; 
        });

        cityResults.appendChild(div); // make it visible 
    });
}

// function for adding a city to the "Chosen cities" section
function addToChosenCities(cityData) {
    // to check if the city is already selected
    const isCityAlreadySelected = selectedCities.some(
        (selected) => selected.name === cityData.name && selected.countryName === cityData.countryName
    );
  
    if (isCityAlreadySelected) { // if it is selected, return nothing 
        return;
    }

    if (selectedCities.length >= MAX_CITIES) { // if the user chooses more than 2 cities 
        selectionMessage.textContent = `Error: You can only select up to ${MAX_CITIES} cities.`; // then return an error message 
        return;
    } else {
        selectionMessage.textContent = "";  // if not, don't do anything 
    }

    selectedCities.push(cityData); // 

    const cityDiv = document.createElement("div"); // for each city create a div 
    cityDiv.className = "chosen-city"; // class name 
    cityDiv.textContent = `${cityData.name}, ${cityData.countryName}`; // what it should look like 

    if (selectedCities.length === 1) {
        cityDiv.style.backgroundColor = "#5E5CE6"; // assigning a specific color to city 2 
    } else if (selectedCities.length === 2) {
        cityDiv.style.backgroundColor = "#A450CF"; // assigning a specific color to city 3 
    }

    const removeButton = document.createElement("span");  // adding the remove button 
    removeButton.textContent = " x"; 
    removeButton.style.cursor = "pointer"; 

    removeButton.addEventListener("click", () => { 
        cityDiv.remove(); 
        selectedCities = selectedCities.filter(
            (selected) => !(selected.name === cityData.name && selected.countryName === cityData.countryName)
        );
        updateNextButtonState(); // disable the next button after removing a city
    });

    cityDiv.appendChild(removeButton); // add the remove button
    chosenCitiesContainer.appendChild(cityDiv); // make it visible 

    updateNextButtonState(); // to allow the next button to be pressed after selecting cities
}

// to initialize the page 
displayManualSuggestions();

// an event listener for input changes to trigger the city filtering
citySearchInput.addEventListener("input", filterCities); 

// add an event listener for the "next button
nextButton.addEventListener('click', () => {
    localStorage.setItem("selectedComparisonCities", JSON.stringify(selectedCities)); // saving the information locally 
    window.location.href = 'avail.html'; // where the next button goes 
});

// an event listener for the back button
backButton.addEventListener("click", () => {
    window.location.href = "basecity.html"; // where the back button goes 
});

// to disable the "Next" button initially
updateNextButtonState();
