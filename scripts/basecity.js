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

// a function to update the next button 
function updateNextButtonState() {
    if (Object.keys(selectedBaseCityData).length > 0) { // if the length of the variable is more than 0
        nextButton.disabled = false; // then the button should not be disabled
        nextButton.classList.remove('disabled'); 
    } else {
        nextButton.disabled = true; // if the length is 0, then the button should be disabled
        nextButton.classList.add('disabled'); 
    }
}

// adding an async function so it can start loading cities from the api 
async function filterCities() {
    const query = citySearchInput.value.trim();

    // only show suggestions if there is more than 2 letters 
    if (query.length < 2) {
        cityResults.style.display = 'none'; // if it is less, then render nothing 
        return;
    }

    try { // grabbing the cities 
        const url = `https://secure.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=${geoNamesUsername}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.geonames) {
            displayCities(data.geonames);
        }
    } catch (error) { // else, there is an error 
        console.error('Error fetching city suggestions:', error);
    }
}

// function to display city results in a dropdown in the search bar
function displayCities(cities) {
    cityResults.innerHTML = ''; // to clear the previous results 
    if (cities.length > 0) { // to show if the cities exist
        cityResults.style.display = 'block'; // to show dropdown
    } else {
        cityResults.style.display = 'none'; // to hide dropdown
    }

    cities.forEach((city) => { // for each city 
        const div = document.createElement('div'); // create a div 
        div.classList.add('result-item'); // class name 
        div.textContent = `${city.name}, ${city.countryName}`; // what it should look like 

        div.addEventListener('click', () => { // if clicked on 
            selectedBaseCityData = { // save these things in an object 
                name: city.name,
                countryName: city.countryName,
                latitude: city.lat,
                longitude: city.lng,
            };
            displayChosenCity(selectedBaseCityData);
        });

        cityResults.appendChild(div); // make it visible 
    });
}

// function to display the chosen base city 
function displayChosenCity(cityData) {
    cityChosenContainer.innerHTML = ''; // to clear previous results 
    citySearchInput.value = ''; // to clear the search input 
    cityResults.style.display = 'none'; 

    const cityTag = document.createElement('div'); // create a div 
    cityTag.classList.add('city-tag'); // class name 
    cityTag.textContent = `${cityData.name}, ${cityData.countryName}`; // what it should look like

    // creating a remove button 
    const removeButton = document.createElement('span'); // creating a span 
    removeButton.textContent = ' x'; // it should be an x 
    removeButton.style.cursor = 'pointer'; // should switch to a pointer to signify button
    removeButton.addEventListener('click', () => { // event listener if clicked on 
        cityTag.remove();
        selectedBaseCityData = {};
        updateNextButtonState();
    });

    cityTag.appendChild(removeButton); // make it visible 
    cityChosenContainer.appendChild(cityTag);

    updateNextButtonState(); // update the next button state after selecting a city
}

// an event listener for input changes to trigger the city filtering
citySearchInput.addEventListener('input', filterCities);

// an event listener for the next button
nextButton.addEventListener('click', () => {
    localStorage.setItem('selectedBaseCityData', JSON.stringify(selectedBaseCityData)); // saving the base city info 
    window.location.href = 'cities.html'; // where the next button should go 
});

// an event listener for the back button
backButton.addEventListener('click', () => { 
    window.location.href = 'index.html'; // where the back button should go 
});

// initializing the next button to first make it disabled
updateNextButtonState();
