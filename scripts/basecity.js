// establishing a few global variables 
const citySearchInput = document.getElementById('city-search'); 
const cityResults = document.getElementById('city-results'); 
const cityChosenContainer = document.getElementById('city-chosen');
const nextButton = document.querySelector('.next-btn');
const backButton = document.querySelector('.back-btn');

// a variable to store the base city data in an object 
let selectedBaseCityData = {};

// logging into the geonames API 
const geoNamesUsername = 'jennliuu';

// adding an async function so it can start loading cities from the api 
async function filterCities(event) {
    // creating the variable query to put search bar recommendations and trimming extra spaces 
    const query = citySearchInput.value.trim();

    // if statement: to start giving recommendations when a user writes more than two characters of a city name
    if (query.length < 2) {
        // if it is less than two characters - don't display anything 
        cityResults.style.display = 'none';
        return;
    }

    // saving the url in a variable 
    const url = `http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=jennliuu`;

    // to retrieve data from the api 
    const response = await fetch(url);
    // converting the data to a javascript format 
    const data = await response.json();

    // if statement: to check if the data exists, if it does, then display the cities 
    if (data && data.geonames) {
        displayCities(data.geonames);
    }
}

// function to display city results in a dropdown in the search bar
function displayCities(cities) {
    // providing an empty dropdown container 
    cityResults.innerHTML = '';
    // setting the style to block 
    cityResults.style.display = 'block';

    cities.forEach(city => { // to iterate over each city in the data - arrow function 
        const div = document.createElement('div'); // creating a div for a city item in the results dropdown
        div.classList.add('result-item'); // adding a class for styling of the result item 
        div.textContent = `${city.name}, ${city.countryName}`; // how each city should look 

        div.onclick = () => { // arrow function for when the city item is clicked on 
            // saving the base city data into an object with its latitude and longitude for timezone conversion in the future 
            selectedBaseCityData = {
                name: city.name,
                countryName: city.countryName,
                latitude: city.lat,
                longitude: city.lng
            }
            // for testing 
            // console.log(selectedBaseCityData);
            displayChosenCity(selectedBaseCityData); // to display the city 
        };

        cityResults.appendChild(div);  // add each city to the results drop down 
    });
}

// function to display the chosen base city 
function displayChosenCity(cityData) {

    // to clear the previous city tag if there is one
    cityChosenContainer.innerHTML = '';

    citySearchInput.value = '';
    cityResults.style.display = 'none';

    // creating a city tag for the city chosen 
    const cityTag = document.createElement('div'); // creating a div for the selected base city 
    cityTag.classList.add('city-tag'); // adding a class for it 
    cityTag.textContent = `${cityData.name}, ${cityData.countryName}`; // only showing the city name and country in the object 

    // creating an element for the remove button in a city div 
    const removeButton = document.createElement('span'); // creating a variable for the remove button
    removeButton.textContent = " x"; // the remove button should be an x
    removeButton.style.cursor = "pointer"; // giving indication it is a button 

    // adding an event listener and arrow function to successfully take out the tag 
    removeButton.addEventListener('click', () => { 
        cityTag.remove(); // remove the city tag 
        selectedBaseCityData = {};
    });

    cityTag.appendChild(removeButton); // adding the button to the city tag 
    cityChosenContainer.appendChild(cityTag); // making the city tag visible to the user 

}


// adding an event listener to run the api every time a user presses a new thing on the keyboard
citySearchInput.addEventListener('keydown', filterCities);


// event listener and arrow function for the next button 
nextButton.addEventListener("click", () => {
    // Validate that a city has been selected
    if (!selectedBaseCityData) {
      alert("Please select a base city before proceeding.");
      return;
    }
  
    localStorage.setItem("selectedBaseCityData", JSON.stringify(selectedBaseCityData));
  
    // Navigate to the next page
    window.location.href = "cities.html";
  }); 

// event listener and arrow function for the back button
  backButton.addEventListener("click", () => {
    // Navigate to the last page 
    window.location.href = "index.html";
  })

// to do 
// currently it still goes on even if no base city is selected 