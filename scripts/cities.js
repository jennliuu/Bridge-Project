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
    { name: "Chicago", countryName: "USA", latitude: "41.85003", longitude: "-87.65005"},
    { name: "Singapore", countryName: "Singapore", latitude: "1.36667", longitude: "103.8", longitude: "103.8"},
    { name: "London", countryName: "UK", latitude: "51.50853", longitude:"-0.12574" },
    { name: "Taipei", countryName: "Taiwan", latitude: "25.05306", longitude: "121.52639" },
];

// setting a variable for the maximum number of cities that can be chosen 
const MAX_CITIES = 2;
// making an empty array for the cities that will be selected later on 
let selectedCities = [];

// function to help display the manually written suggestions 
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

// copying over code for the basecity page with a few adjustments 
// adding an async function so it can start loading cities from the api 
async function filterCities(event) {
    // creating the variable query to put search bar recommendations and trimming extra spaces 
    const query = citySearchInput.value.trim();

    // if statement: to start giving recommendations when a user writes more than two characters of a city name
    if (query.length < 2) {
        // if it is less than two characters - don't display anything 
        cityResults.style.display = "none";
        return;
    }

    // saving the url in a variable 
    const url = `https://secure.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=jennliuu`;

    // to retrieve data from the api 
    const response = await fetch(url);
    // converting the data to a javascript format 
    const data = await response.json();

    // if statement: to check if the data exists, if it does, then display the cities 
    if (data && data.geonames) {
        displayCities(data.geonames);
    }
}

// a function to display the cities for the search bar
function displayCities(cities) {
    // providing an empty dropdown container 
    cityResults.innerHTML = ""; 
    // setting the style to block 
    cityResults.style.display = "block";

    cities.forEach((cityData) => { // to iterate over each city in the data 
        const div = document.createElement("div"); // creating a div for a city item in the results dropdown
        div.classList.add("result-item"); // adding a class for styling of the result item 
        div.textContent = `${cityData.name}, ${cityData.countryName}`; // how each city should look 

        div.addEventListener("click", () => { // event listener for when the city is clicked on 
            // for each city that is clicked on - save it as an object 
            addToChosenCities({ 
                name: cityData.name, 
                countryName: cityData.countryName,
                latitude: cityData.lat,
                longitude: cityData.lng
            });
            cityResults.style.display = "none"; // to hide the results after a city is selected 
            document.getElementById("city-search").value = ""; // clearing the user input 
        });

        cityResults.appendChild(div); // add each city to the results drop down 
    });
}

// function for adding a city to the "Chosen cities" section 
function addToChosenCities(cityData) {
    // if statement: to help prevent any duplicates 
    if (selectedCities.some((selected) => selected.name === cityData.name && selected.countryName === cityData.countryName)) {
        return; 
    }

    // if statement: to check that only 2 cities can be clicked on 
    if (selectedCities.length >= MAX_CITIES) {
        selectionMessage.textContent = `Error: You can only select up to ${MAX_CITIES} cities.`;
        return;
    } else {
        selectionMessage.textContent = ""; // clearing message once its one or two cities 
    }

    // pushing a city to the array if selected 
    selectedCities.push(cityData);

    // city tag 
    const cityDiv = document.createElement("div"); // making a div for it 
    cityDiv.className = "chosen-city"; // what it would be called 
    cityDiv.textContent = `${cityData.name}, ${cityData.countryName}`; // what it should look like - just the city name and country name

    // adding a remove button x 
    const removeButton = document.createElement("span"); // making a span 
    removeButton.textContent = " x"; // it should be an x 
    removeButton.style.cursor = "pointer"; // indication of a button 

    removeButton.addEventListener("click", () => { // when the button is pressed on 
        cityDiv.remove(); // removing the div 
        selectedCities = selectedCities.filter(
            (selected) => !(selected.name === city.name && selected.countryName === city.countryName)
        );
        selectionMessage.textContent = "";
    });

    // append the remove button to the city tags 
    cityDiv.appendChild(removeButton);
    // append the city tag to the container 
    chosenCitiesContainer.appendChild(cityDiv);
}

// calling functions 
displayManualSuggestions();
document.getElementById("city-search").addEventListener("input", filterCities);


// event listener go to the next page 
nextButton.addEventListener('click', () => {
    localStorage.setItem("selectedComparisonCities", JSON.stringify(selectedCities));

    console.log(selectedCities);
    // pressing the button to get to the next page 
    window.location.href = 'avail.html';
});

// event listener for the back button
backButton.addEventListener("click", () => {
    // Navigate to the last page 
    window.location.href = "basecity.html";
  })


  // to do 
  // i want base city 1 to have one color and base city 2 to have another color 
  // the error message isnt working correctly 