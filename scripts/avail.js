// getting the previous cities from the local storage 
const baseCityData = JSON.parse(localStorage.getItem("selectedBaseCityData")); // base city 
const otherCities = JSON.parse(localStorage.getItem("selectedComparisonCities")); // other cities 
const baseCityContainer = document.getElementById("base-city-container"); // container for the base city 
const otherCitiesContainer = document.getElementById("other-cities-container"); // container for the other cities 
const nextButton = document.querySelector('.next-btn');
const backButton = document.querySelector('.back-btn');

// function to create a time input block for each city 
function createTimeInputBlock(cityData, isBaseCity = false, cityIndex = null) {
  const cityRow = document.createElement("div"); // creating a div for each city 
  cityRow.className = "city"; // what each div would be called 

  const cityNameDiv = document.createElement("div"); // creating a city tag for each city 
  cityNameDiv.className = "city-name"; // a class name for the city 
  cityNameDiv.textContent = `${cityData.name}, ${cityData.countryName}`; // each city tag will reflect the actual city name 

  // Assign colors based on the city position
  if (isBaseCity) {
    cityNameDiv.style.backgroundColor = "#385C89"; // Base City color
  } else if (cityIndex === 0) {
    cityNameDiv.style.backgroundColor = "#5E5CE6"; // City 2 color
  } else if (cityIndex === 1) {
    cityNameDiv.style.backgroundColor = "#A450CF"; // City 3 color
  }

  const timeInputDiv = document.createElement("div"); // creating a div for each time input 
  timeInputDiv.className = "time-input";

  // variables for time inputs 
  const startHour = createTimeInput("number", "09", 1, 12); // start with placeholder 9:00AM - and specify min and max numbers 
  const startMinute = createTimeInput("number", "00", 0, 59);
  const startPeriod = createSelect(["AM", "PM"]); // give users the option to set AM or PM 

  // variables for the second set of time inputs 
  const endHour = createTimeInput("number", "05", 1, 12); // start with placeholder 5:00PM - and specify min and max numbers 
  const endMinute = createTimeInput("number", "00", 0, 59);
  const endPeriod = createSelect(["PM", "AM"]);

  // to create each block of time input 
  timeInputDiv.appendChild(startHour); // putting the starting hours first 
  timeInputDiv.appendChild(document.createTextNode(":")); // adding a colon 
  timeInputDiv.appendChild(startMinute); 
  timeInputDiv.appendChild(startPeriod); 
  timeInputDiv.appendChild(document.createTextNode(" — ")); // adding a dash for this time to this time 
  timeInputDiv.appendChild(endHour);
  timeInputDiv.appendChild(document.createTextNode(":")); // adding a colon 
  timeInputDiv.appendChild(endMinute);
  timeInputDiv.appendChild(endPeriod);

  cityRow.appendChild(cityNameDiv); // appending the city tag to the first container 
  cityRow.appendChild(timeInputDiv); // appending the time blocks to the first container 

  return cityRow; // making the cityRow div available at the end 
}

// function that creates the time input blocks 
function createTimeInput(type, placeholder, min, max) {
  const input = document.createElement("input"); // creating inputs
  input.type = type; // control what the user can input 
  input.placeholder = placeholder; // the placeholder numbers 
  input.min = min; // the minimum number 
  input.max = max; // the maximum number 
  input.required = true; // make sure there is input 
  return input; // return the time input blocks 
}

// function to create a dropdown element 
function createSelect(options) {
  const select = document.createElement("select"); // creating a container with dropdown options 
  options.forEach((option) => { // to go over each option 
    const opt = document.createElement("option"); // then create the option to select that choice 
    opt.value = option; // making the array a string 
    opt.textContent = option; // what the content should be -- AM, PM 
    select.appendChild(opt);
  });
  return select; // return the dropdown element 
}

// populate the base city
function populateBaseCity() {
  if (baseCityData) { // if statement: if it is the base city then add 
    const baseCityBlock = createTimeInputBlock(baseCityData, true); 
    baseCityContainer.appendChild(baseCityBlock); // add the city tag and time input into the base city container 
  }
}

// populate the other cities 
function populateOtherCities() {
  if (otherCities && otherCities.length > 0) { // making sure there are cities to add 
    otherCities.forEach((cityObj, index) => { // to go over each city 
      const otherCityBlock = createTimeInputBlock(cityObj, false, index); 
      otherCitiesContainer.appendChild(otherCityBlock); // add the city tags and time input into the other cities container 
    });
  }
}

// save the availabilities to the local storage
function saveAvailabilities() {
  const availabilities = [];

  // to save base city availability information 
  const baseInputs = baseCityContainer.querySelectorAll("input, select");
  availabilities.push({
    city: baseCityData,
    start: {  // saving the information into objects 
      hour: baseInputs[0].value || "09", 
      minute: baseInputs[1].value || "00",
      period: baseInputs[2].value || "AM",
    },
    end: {
      hour: baseInputs[3].value || "05",
      minute: baseInputs[4].value || "00",
      period: baseInputs[5].value || "PM",
    },
  });

  // save the other cities' availabilities
  const otherCityBlocks = otherCitiesContainer.children;
  Array.from(otherCityBlocks).forEach((block, index) => {
    const inputs = block.querySelectorAll("input, select");
    availabilities.push({
      city: otherCities[index],
      start: {
        hour: inputs[0].value || "09",
        minute: inputs[1].value || "00",
        period: inputs[2].value || "AM",
      },
      end: {
        hour: inputs[3].value || "05",
        minute: inputs[4].value || "00",
        period: inputs[5].value || "PM",
      },
    });
  });

  // storing the user-inputted availabilities in local storage 
  localStorage.setItem("cityAvailabilities", JSON.stringify(availabilities));
}

// call functions 
populateBaseCity();
populateOtherCities();

// event listener go to the next page 
nextButton.addEventListener('click', () => {
    saveAvailabilities();
    window.location.href = 'altogether.html'; // where the next button should go 
});

// event listener for the back button
backButton.addEventListener("click", () => {
  window.location.href = "cities.html"; // where the back page should go 
})