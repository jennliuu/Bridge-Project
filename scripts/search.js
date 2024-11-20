const citySearchInput = document.getElementById('city-search');
const cityResults = document.getElementById('city-results');
const cityChosenContainer = document.getElementById('city-chosen'); // For chosen city tags
let selectedCity = ''; // Store selected city name here

// Replace with your GeoNames API username
const geoNamesUsername = 'jennliuu';

// Function to fetch cities from the GeoNames API
async function filterCities(event) {
    const query = citySearchInput.value.trim();

    // Check if the Enter key was pressed and if a city is selected
    if (event.key === "Enter" && selectedCity) {
        displayChosenCity(selectedCity);
        return;
    }

    if (query.length < 3) {
        cityResults.style.display = 'none';
        return;
    }

    const url = `http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=${geoNamesUsername}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.geonames) {
            displayCities(data.geonames);
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

// Function to display city results in the dropdown
function displayCities(cities) {
    cityResults.innerHTML = '';
    cityResults.style.display = 'block';

    cities.forEach(city => {
        const div = document.createElement('div');
        div.classList.add('result-item');
        div.textContent = `${city.name}, ${city.countryName}`;

        div.onclick = () => {
            selectedCity = `${city.name}, ${city.countryName}`;
            displayChosenCity(selectedCity);
        };

        cityResults.appendChild(div);
    });
}

// Function to display the chosen city as a tag
function displayChosenCity(city) {
    citySearchInput.value = '';
    cityResults.style.display = 'none';

     // Prevent adding more than 2 cities
     if (cityChosenContainer.children.length >= 2) {
        alert("You can only select up to 2 cities.");
        return;
    }

    // Prevent duplicate entries
    // if (chosenCities.includes(cityLabel)) {
    //     alert("City already chosen!");
    //     return;
    // }

     // Create the tag element
     const cityTag = document.createElement("div");
     cityTag.classList.add("city-tag");
     cityTag.textContent = `${city}`;
 
    //  // Add a remove button
     const removeButton = document.createElement("span");
     removeButton.textContent = " x";
     removeButton.style.cursor = "pointer";
 
    //  // Add a click event to remove only the specific tag
     removeButton.onclick = () => {
         cityTag.remove(); // Only removes this city tag
     };
 
     cityTag.appendChild(removeButton);
     cityChosenContainer.appendChild(cityTag);

    // Clear previous city chosen tag

    // // Create the tag element
    // const cityTag = document.createElement('div');
    // cityTag.classList.add('city-tag');
    // cityTag.textContent = `${city} x`;

    // Add a click event to remove the city if needed
    // cityTag.onclick = () => {
    //     cityChosenContainer.innerHTML = '';
    //     selectedCity = '';
    // };

    // cityChosenContainer.appendChild(cityTag); 
}

// Add event listener for keydown to detect "Enter" key
citySearchInput.addEventListener('keydown', filterCities);

