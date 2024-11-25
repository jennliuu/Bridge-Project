// getting the previous cities from the local storage 
const baseCityData = JSON.parse(localStorage.getItem("selectedBaseCityData")); // base city 
const otherCities = JSON.parse(localStorage.getItem("selectedComparisonCities")); // other cities 
const baseCityContainer = document.getElementById("base-city-container"); // container for the base city 
const otherCitiesContainer = document.getElementById("other-cities-container"); // container for the other cities 
const nextButton = document.querySelector('.next-btn');
const backButton = document.querySelector('.back-btn');

// testing purposes 
// console.log(otherCities[0]);


// a function to create a time input block for each city 
function createTimeInputBlock(cityData, isBaseCity = false) {
    console.log(cityData);
  const cityRow = document.createElement("div"); // creating a div for each city 
  cityRow.className = "city"; // what each div would be called 

  const cityNameDiv = document.createElement("div"); // creating a city tag for each city 
  cityNameDiv.className = "city-name"; // a class name for the city 
  cityNameDiv.textContent = `${cityData.name}, ${cityData.countryName}`; // each city tag will reflect the actual city name 
  cityNameDiv.style.backgroundColor = isBaseCity ? "#ffa726" : generateColor(); // if it is the base city - setting it to be orange, 
  // if not, run the generatecolor function 

  const timeInputDiv = document.createElement("div"); // creating a div for each time input 
  timeInputDiv.className = "time-input";

  // variables for time inputs 
  const startHour = createTimeInput("number", "09", 1, 12); // start with placeholder 9:00AM - and specify min and max numbers 
  const startMinute = createTimeInput("number", "00", 0, 59);
  const startPeriod = createSelect(["AM", "PM"]); // give users the option to set AM or PM 

  // variables for the second set of time inputs 
  const endHour = createTimeInput("number", "05", 1, 12); // start with placeholder 5:00PM - and specify min and max numbers 
  const endMinute = createTimeInput("number", "00", 0, 59);
  const endPeriod = createSelect(["AM", "PM"]);

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

// a function that creates the time input blocks 
function createTimeInput(type, placeholder, min, max) {
  const input = document.createElement("input"); // creating inputs
  input.type = type; // control what the user can input 
  input.placeholder = placeholder; // the placeholder numbers 
  input.min = min; // the minimum number 
  input.max = max; // the maximum number 
  input.required = true; // make sure there is input 
  return input; // return the time input blocks 
}

// a function that helps create a dropdown element 
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

// creating a function to assign the other cities two random colors based off the color palette -- need to change 
function generateColor() {
  const colors = ["#FF375F", "#BF5AF2", "#30D158"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// to add the base city
function populateBaseCity() {
  if (baseCityData) { // if statement: if it is the base city then add 
    const baseCityBlock = createTimeInputBlock(baseCityData, true); 
    baseCityContainer.appendChild(baseCityBlock); // add the city tag and time input into the base city container 
  }
}

// to add the other cities 
function populateOtherCities() {
  if (otherCities && otherCities.length > 0) { // making sure there are cities to add 
    otherCities.forEach((cityObj) => { // to go over each city 
      const otherCityBlock = createTimeInputBlock(cityObj); 
      otherCitiesContainer.appendChild(otherCityBlock); // add the city tags and time input into the other cities container 
    });
  }
}

// a function to help save the availabilities to the local storage
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

  // to save the other cities' availabilities
  const otherCityBlocks = otherCitiesContainer.children;
  Array.from(otherCityBlocks).forEach((block, index) => {
    const inputs = block.querySelectorAll("input, select");
    const cityName = `${otherCities[index].name}, ${otherCities[index].country}`;
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


// calling functions 
populateBaseCity();
populateOtherCities();


// event listener go to the next page 
nextButton.addEventListener('click', () => {
    saveAvailabilities();
    // pressing the button to get to the next page 
    window.location.href = 'altogether.html';
});

// event listener for the back button
backButton.addEventListener("click", () => {
  // Navigate to the last page 
  window.location.href = "cities.html";
})


// to do 
// want to assign other city 1 and other city 2 a specific color and no longer randomize it 
// maybe switch the later time input to a pm variable 