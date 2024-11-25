/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */

// Calling the luxon library
const { DateTime } = luxon;

// global variables 
const citiesContainer = document.getElementById("cities-container");
const notesContainer = document.getElementById("notes-container");
const baseCityHeading = document.getElementById("base-city-heading");
const graphContainer = document.getElementById("graph-container");
const graphHours = document.getElementById("graph-hours");
const updateButton = document.getElementById('update-btn');

// event listener for modal display 
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("welcome-modal"); // retrieving the element 
    const closeButton = document.getElementById("close-modal-btn"); // getting the button element 
  
    // to show the modal when the page loads
    modal.style.display = "block";
  
    // to close the modal when the close button is clicked
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

  });

// manually inputting the base city and other two cities for the first page 
// saving them in objects 
const baseCity = {
  name: "Taipei",
  countryName: "Taiwan",
  timezone: "Asia/Taipei",
  latitude: 25.0330,
  longitude: 121.5654,
};

// manually inputting the other cities 
const otherCities = [
  {
    name: "New York",
    countryName: "USA",
    timezone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    name: "London",
    countryName: "UK",
    timezone: "Europe/London",
    latitude: 51.5074,
    longitude: -0.1278,
  },
];

// manually inputting city availabilities in arrays 
const availabilities = [
  {
    city: baseCity,
    start: { hour: "09", minute: "00", period: "AM" },
    end: { hour: "05", minute: "00", period: "PM" },
  },
  {
    city: otherCities[0],
    start: { hour: "09", minute: "00", period: "AM" },
    end: { hour: "05", minute: "00", period: "PM" },
  },
  {
    city: otherCities[1],
    start: { hour: "09", minute: "00", period: "AM" },
    end: { hour: "05", minute: "00", period: "PM" },
  },
];

// under this is all reused code of altogether.js 
// a function to help convert the other cities into the base timezone 
function convertToBaseTimezone(cityAvailability, cityTimezone, baseTimezone) {
  // taking apart the availabilities to start and end times to different objects 
  const { start, end } = cityAvailability;
  
  // converting the inputted times from the 12 hour format to the 24 hour format to help with timezone conversions 
  let startHour;
  if (start.period === "PM" && start.hour !== "12") {
    startHour = parseInt(start.hour) + 12;
  } else {
    startHour = parseInt(start.hour);
  }
  let endHour;
  if (end.period === "PM" && end.hour !== "12") {
    endHour = parseInt(end.hour) + 12;
  } else {
    endHour = parseInt(end.hour);
  }
  
  // using luxon's fromObject method to find the citys local timezone for the start and end times 
  const startTime = DateTime.fromObject(
    { hour: startHour, minute: parseInt(start.minute) },
    { zone: cityTimezone }
  );
  const endTime = DateTime.fromObject(
    { hour: endHour, minute: parseInt(end.minute) },
    { zone: cityTimezone }
  );
  
  // using luxon's setZone method to change the other cities to the base timezone! 
  const startInBase = startTime.setZone(baseTimezone);
  const endInBase = endTime.setZone(baseTimezone);
  
  // returning the values back and switching them back to the 12 hour format 
  return {
    start: startInBase.toFormat("hh:mm a"),
    end: endInBase.toFormat("hh:mm a"),
    startHour: startInBase.hour,
    endHour: endInBase.hour,
  };
}

// A function to update the city cards
function updateCityCards() {
    citiesContainer.innerHTML = ""; // to start with blank city cards 

  // making the card for the base city 
  const baseCard = document.createElement("div"); // adding a div 
  baseCard.className = "city-card"; // the class name 
  // adding the html in the card 
  baseCard.innerHTML = `
    <h2 class="city-name base-city-name">${baseCity.name}, ${baseCity.countryName}</h2>
    <p class="timezone">
      Base timezone: <span class="time-range base-time-range">${availabilities[0].start.hour}:${availabilities[0].start.minute}${availabilities[0].start.period} — ${availabilities[0].end.hour}:${availabilities[0].end.minute}${availabilities[0].end.period}</span>
    </p>
  `;
  citiesContainer.appendChild(baseCard); // making it visible 

  // making cards for the other cities
  // iterating over each city in the array  
  otherCities.forEach((city, index) => { 
    // saving a variable to convert the other city timezones to the base city timezone by calling the convert function 
    const convertedTimes = convertToBaseTimezone( 
      availabilities[index + 1], 
      city.timezone, 
      baseCity.timezone 
    );
    const card = document.createElement("div"); // adding a div 
    card.className = "city-card"; // the class name 
    const cityClass = index === 0 ? "second-city-name" : "third-city-name";
    const timeRangeClass = index === 0 ? "second-time-range" : "third-time-range";
    // adding the extra html in the card 
    card.innerHTML = `
      <h2 class="city-name ${cityClass}">${city.name}, ${city.countryName}</h2>
      <p class="timezone">
        Actual time: <span class="time-range actual-time-range">${availabilities[index + 1].start.hour}:${availabilities[index + 1].start.minute}${availabilities[index + 1].start.period} — ${availabilities[index + 1].end.hour}:${availabilities[index + 1].end.minute}${availabilities[index + 1].end.period}</span>
      </p>
      <p class="timezone">
        Converted time: <span class="time-range ${timeRangeClass}">${convertedTimes.start} — ${convertedTimes.end}</span>
      </p>
      <button class="base-btn" onclick="setNewBaseCity('${city.name}')">Make base timezone</button>
    `;
    citiesContainer.appendChild(card); // making it visible 
    
  });
}

// function to create the graph 
function generateTimeTable() {
    // clearing any existing content 
    graphContainer.innerHTML = "";
    graphHours.innerHTML = "";
  
    // a for loop: to help generate the hourly labels 
    for (let hour = 0; hour < 24; hour++) {
      const hourBlock = document.createElement("div"); // create a div for each 
      // Format hours with special cases for 12 AM and 12 PM
  
      // a bunch of if statements to help put hourly labels 
      let formattedHour = "";
  
      if (hour === 0) {
        // if the hour is 0 then make it 12am 
        formattedHour = "12 AM";
      } else if (hour === 12) {
        // if the hour is 12, then make it 12pm 
        formattedHour = "12 PM";
      } else if (hour < 12) {
        // am hours 
        formattedHour = `${hour}`;
      } else {
        // pm hours 
        formattedHour = `${hour - 12}`;
      }
  
      hourBlock.textContent = formattedHour;
      hourBlock.classList.add("hour-label");
      graphHours.appendChild(hourBlock); // make it visible 
    }
  
    // generate the row of availability for each city 
    const cities = [baseCity, ...otherCities]; // combine the base city and other cities to iterate in an array 
    cities.forEach((city, rowIndex) => { // for each city 
      const cityAvailability = availabilities[rowIndex]; // start with the base city 
      // converting to the base timzones 
      const convertedTimes = convertToBaseTimezone(
        cityAvailability,
        city.timezone,
        baseCity.timezone
      );
  
      // getting the start and end times 
      let startHour = convertedTimes.startHour;
      let endHour = convertedTimes.endHour;
  
      // adding a loop around if the availability goes past 12am 
      if (endHour <= startHour) {
        endHour += 24; 
      }
  
      // going through all 24 blocks of time 
      for (let blockIndex = 0; blockIndex < 24; blockIndex++) {
        const square = document.createElement("div"); // creating a div 
        square.classList.add("availability-square"); // naming it availability square 
  
        // to determine if the hour falls within the availability 
        const blockHour = blockIndex % 24;
        if (
          (blockHour >= startHour && blockHour <= endHour) || // for a normal case 
          (blockHour + 24 >= startHour && blockHour + 24 <= endHour) // for a wrap around case 
        ) {
          // city colors based on their index on the array 
          if (rowIndex === 0) {
            square.style.backgroundColor = "#ffa726"; // base city color 
          } else if (rowIndex === 1) {
            square.style.backgroundColor = "#FF375F"; // first other city color 
          } else {
            square.style.backgroundColor = "#BF5AF2"; // second other city color 
          }
        } else { 
          // for every other box, just putting gray 
          square.style.backgroundColor = "#F3F3F3"; 
        }
  
        graphContainer.appendChild(square); // making it visible 
      }
    });
  }

// a function to update notes -- to be updated 
function updateNotes() {
    notesContainer.innerHTML = `
      <p>1. New York and London have availability from 9PM-1AM CST</p>
      <p>2. There are no overlapping availabilities for all three cities</p>
    `;
  } 

// initialize the page
function init() {
  baseCityHeading.textContent = `Currently showing timezones converted to ${baseCity.name}`;
  updateCityCards();
  updateNotes();
  generateTimeTable();
}

// run initialization
init();

// event listener go to the next page 
updateButton.addEventListener('click', () => {
    // pressing the button to get to the next page 
    window.location.href = 'basecity.html';
});

