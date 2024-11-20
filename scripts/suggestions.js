// Example: Preloaded city data (can be fetched dynamically as an improvement)
const cities = [
    { name: "Mumbai", country: "India" },
    { name: "Wales", country: "UK" },
    { name: "Chicago", country: "USA" },
    { name: "Singapore", country: "Singapore" },
    { name: "Taipei", country: "Taiwan" },
    { name: "Sydney", country: "Australia" },
    { name: "New York", country: "USA" },
    { name: "London", country: "UK" },
];

// Select random cities for suggestions
function getRandomCities(cities, count = 4) {
    const shuffled = cities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display suggestions
function displaySuggestions() {
    const randomCities = getRandomCities(cities, 4); // Get 4 random cities
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions

    randomCities.forEach((city) => {
        const cityDiv = document.createElement("div");
        cityDiv.className = "suggestion-item";
        cityDiv.textContent = `${city.name}, ${city.country}`;
        cityDiv.onclick = () => addToChosenCities(city);
        suggestionsContainer.appendChild(cityDiv);
    });
}

// Add a city to the "Cities Chosen" section
function addToChosenCities(city) {
    const chosenCitiesContainer = document.getElementById("city-chosen");

    // Prevent duplicates
    if ([...chosenCitiesContainer.children].some((child) => child.textContent === `${city.name}, ${city.country} x`)) {
        return;
    }

    const cityDiv = document.createElement("div");
    cityDiv.className = "chosen-city";
    cityDiv.textContent = `${city.name}, ${city.country} x`;

    // Add remove functionality
    cityDiv.onclick = () => cityDiv.remove();

    chosenCitiesContainer.appendChild(cityDiv);
}

//update suggestions to reflect the same as search 

// Initialize the suggestions area
displaySuggestions();