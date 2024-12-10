// calling the luxon library 
const { DateTime } = luxon;

// establishing global variables 
const citiesContainer = document.getElementById("cities-container");
const notesContainer = document.getElementById("notes-container");
const baseCityHeading = document.getElementById("base-city-heading");
const graphContainer = document.getElementById("graph-container");
const graphHours = document.getElementById("graph-hours");
const updateButton = document.getElementById('update-btn');

// getting the local storage data 
let baseCity = JSON.parse(localStorage.getItem("selectedBaseCityData"));
let otherCities = JSON.parse(localStorage.getItem("selectedComparisonCities")); // other cities 
let availabilities = JSON.parse(localStorage.getItem("cityAvailabilities"));

// for testing 
// console.log("Base City Data:", baseCity);
// console.log("Other Cities Data:", otherCities);
// console.log("Availabilities:", availabilities);

// function to help convert the latitude and longitude to the correct timezone
async function fetchTimezone(latitude, longitude) {
  const url = `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=jennliuu`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.timezoneId || null;
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return null;
  }
}

// to check if the three cities have timezones 
async function ensureTimezones() {
  // if statement: base city checking 
  if (!baseCity.timezone) {
    baseCity.timezone = await fetchTimezone(baseCity.latitude, baseCity.longitude);
  }

  // for loop: for checking if the other cities have timezones 
  for (let i = 0; i < otherCities.length; i++) {
    if (!otherCities[i].timezone) {
      otherCities[i].timezone = await fetchTimezone(otherCities[i].latitude, otherCities[i].longitude);
    }
  }

  for (let i = 0; i < availabilities.length; i++) {
    availabilities[i].city.timezone = await fetchTimezone(availabilities[i].city.latitude, availabilities[i].city.longitude);
  }

  // save the timezones into the local storage with the base city and other cities 
  localStorage.setItem("selectedBaseCityData", JSON.stringify(baseCity));
  localStorage.setItem("selectedComparisonCities", JSON.stringify(otherCities));
  localStorage.setItem("cityAvailabilities", JSON.stringify(availabilities));
}


// function to convert the other two cities into the base timezone 
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


  function updateCityCards() {
    citiesContainer.innerHTML = ""; // to start with blank city cards 
  
    // goes through all the city availabilities
    availabilities.forEach((availability, index) => {
      // assign indexes 
      const cityClass = index === 0 ? "first-city-name" : index === 1 ? "second-city-name" : "third-city-name";
      const timeRangeClass = index === 0 ? "first-time-range" : index === 1 ? "second-time-range" : "third-time-range";
  
      // Check if the city is the current base city
      const isBaseCity = availability.city.name === baseCity.name && availability.city.countryName === baseCity.countryName;
  
      // Create the card
      const card = document.createElement("div");
      card.className = `city-card ${isBaseCity ? "highlight" : ""}`; // Add a highlight class if it's the base city
  
      // Add the inner content of the card
      card.innerHTML = `
        <h2 class="city-name ${cityClass}">
          ${availability.city.name}, ${availability.city.countryName}
        </h2>
        <p class="timezone">
          ${isBaseCity ? "Base timezone:" : "Original time:"} 
          <span class="time-range ${timeRangeClass}">
            ${availability.start.hour}:${availability.start.minute}${availability.start.period} — ${availability.end.hour}:${availability.end.minute}${availability.end.period}
          </span>
        </p>
        ${
          isBaseCity
            ? "" 
            : `<p class="timezone">
                Converted time: <span class="time-range ${timeRangeClass}">
                ${convertToBaseTimezone(availability, availability.city.timezone, baseCity.timezone).start} — ${convertToBaseTimezone(availability, availability.city.timezone, baseCity.timezone).end}
                </span>
              </p>
              <button class="base-btn" onclick="setNewBaseCity('${availability.city.name}')">Set to main timezone</button>`
        }
      `;
  
      citiesContainer.appendChild(card); // Append the card
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
      hourBlock.classList.add("highlight-blue"); // adding special class for styling
    } else if (hour === 12) {
      // if the hour is 12, then make it 12pm 
      formattedHour = "12 PM";
      hourBlock.classList.add("highlight-blue"); // adding special class for styling
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
  availabilities.forEach((availability, rowIndex) => { // for each city 
    // converting to the base timzones 
    const convertedTimes = convertToBaseTimezone(
      availability,
      availability.city.timezone,
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
        (blockHour >= startHour && blockHour < endHour) || // for a normal case 
        (blockHour + 24 >= startHour && blockHour + 24 < endHour) // for a wrap around case 
      ) {
        // city colors based on their index on the array 
        if (rowIndex === 0) {
          square.style.backgroundColor = "#385C89"; // first city color 
        } else if (rowIndex === 1) {
          square.style.backgroundColor = "#5E5CE6"; // second city color 
        } else {
          square.style.backgroundColor = "#A450CF"; // third city color 
        }
      } else { 
        // for every other box, just putting gray 
        square.style.backgroundColor = "#EEEBEB"; 
      }

      graphContainer.appendChild(square); // making it visible 
    }
  });
}

  function updateNotes() {
    let notes = [];
  // Normalize times to account for wrap-around
  const normalizeTime = (startHour, endHour) => {
    if (endHour < startHour) {
      // Treat the end hour as being in the next day
      endHour += 24;
    }
    return { startHour, endHour };
  };
  
    // get the base city availability
    const baseAvailability = availabilities.find(
      (availability) =>
        availability.city.name === baseCity.name &&
        availability.city.countryName === baseCity.countryName
    );
  
    if (!baseAvailability) {
      console.error("Base city availability not found.");
      notesContainer.innerHTML = "<p>Unable to calculate overlapping times.</p>";
      return;
    }
  
    // convert base city times into DateTime objects
    const baseTimeInformation = convertToBaseTimezone(baseAvailability, baseCity.timezone, baseCity.timezone);
    const baseTimes = normalizeTime(baseTimeInformation.startHour, baseTimeInformation.endHour);

    // store the converted times for City 2 and City 3
    let convertedCities = [];
    otherCities.forEach((city) => {
      const otherAvailability = availabilities.find(
        (availability) =>
          availability.city.name === city.name &&
          availability.city.countryName === city.countryName
      );
  
      if (otherAvailability) {
        const convertedOther = convertToBaseTimezone(otherAvailability, city.timezone, baseCity.timezone);
        convertedCities.push({ city, times: normalizeTime(convertedOther.startHour, convertedOther.endHour) });
      }
    });
  
    // check for overlaps across all three cities
    if (convertedCities.length === 2) {
      const [city2, city3] = convertedCities;

      // normalize times for city2 and city3
      const city2Times = normalizeTime(city2.times.startHour, city2.times.endHour);
      const city3Times = normalizeTime(city3.times.startHour, city3.times.endHour);
  
      const overlapStart = Math.max(
        baseTimes.startHour,
        city2Times.startHour,
        city3Times.startHour
      );
      const overlapEnd = Math.min(
        baseTimes.endHour,
        city2Times.endHour,
        city3Times.endHour
      );
  
      if (overlapStart < overlapEnd) { // include end time
        const overlapStartFormatted = DateTime.fromObject({ hour: overlapStart }).toFormat("hh:mm a");
        const overlapEndFormatted = DateTime.fromObject({ hour: overlapEnd }).toFormat("hh:mm a");
  
        notesContainer.innerHTML = `<p>All three cities have availability to call from ${overlapStartFormatted} to ${overlapEndFormatted} ${baseCity.name} time.</p>`;
        return; // exit early if all three overlap
      }
    }
  
    // check for overlaps with the base city and each other city
    convertedCities.forEach(({ city, times }) => {

      const cityTime = normalizeTime(times.startHour, times.endHour);


      const overlapStart = Math.max(baseTimes.startHour, cityTime.startHour);
      const overlapEnd = Math.min(baseTimes.endHour, cityTime.endHour);
  
      if (overlapStart < overlapEnd) { // include end time
        const overlapStartFormatted = DateTime.fromObject({ hour: overlapStart % 24 }).toFormat("hh:mm a");
        const overlapEndFormatted = DateTime.fromObject({ hour: overlapEnd % 24 }).toFormat("hh:mm a");
  
        notes.push(
          `${baseCity.name} and ${city.name} have overlapping times to call from ${overlapStartFormatted} to ${overlapEndFormatted} ${baseCity.name} time.`
        );
      }
    });
  
    if (convertedCities.length === 2) {
      const [city2, city3] = convertedCities;
        
      // normalize times for city2 and city3
      const city2Times = normalizeTime(city2.times.startHour, city2.times.endHour);
      const city3Times = normalizeTime(city3.times.startHour, city3.times.endHour);
    
      // check for overlap
      const overlapStart = Math.max(city2Times.startHour, city3Times.startHour);
      const overlapEnd = Math.min(city2Times.endHour, city3Times.endHour);
    
      // where overlap spans past midnight
      if (overlapStart < overlapEnd) { // Overlap exists
        const overlapStartFormatted = DateTime.fromObject({ hour: overlapStart % 24 }).toFormat("hh:mm a");
        const overlapEndFormatted = DateTime.fromObject({ hour: overlapEnd % 24 }).toFormat("hh:mm a");
    
        notes.push(
          `${city2.city.name} and ${city3.city.name} have overlapping times to call from ${overlapStartFormatted} to ${overlapEndFormatted} ${baseCity.name} time.`
        );
      }
    }
  
    // if no notes were added, fallback message
    if (notes.length === 0) {
      notes.push("* All three cities have no overlapping times. Try another availability!");
    }

    // display notes with asterisks
    notesContainer.innerHTML = notes.map((note) => `<p>* ${note}</p>`).join("");
  }

function setNewBaseCity(newBaseCityName) {
  // find the new base city from the otherCities array
  const newBaseCityIndex = otherCities.findIndex(city => city.name === newBaseCityName);

  if (newBaseCityIndex !== -1) {
    // swap the current base city with the new base city
    const newBaseCity = otherCities[newBaseCityIndex];
    otherCities.splice(newBaseCityIndex, 1); // remove the new base city from otherCities
    otherCities.unshift(baseCity); // move the current base city into otherCities
    baseCity = newBaseCity; // update the base city

    // save the changes to local storage
    localStorage.setItem("selectedBaseCityData", JSON.stringify(baseCity));
    localStorage.setItem("selectedComparisonCities", JSON.stringify(otherCities));

    // update the city cards to reflect the new base city
    updateCityCards();
    generateTimeTable();
    updateNotes(); // ensure the notes are updated with the new base city
    // update the heading 
    baseCityHeading.textContent = `Currently showing timezones converted to ${baseCity.name}`;

  } else {
    console.error("City not found in otherCities array");
  }
}

// to help initialize the page 
async function init() {
  if (!baseCity || !otherCities || !availabilities) {
    alert("Missing required data. Please go back and reselect cities.");
    return;
  }

  // to ensure all the cities have timezones 
  await ensureTimezones();

  // to add the base city headline 
  baseCityHeading.textContent = `Currently showing timezones converted to ${baseCity.name}`;

  // calling functions 
  updateCityCards();
  generateTimeTable()
  updateNotes();
}

// Run initialization
init();

// event listener go to the next page 
updateButton.addEventListener('click', () => {
  // pressing the button to get to the next page 
  window.location.href = 'basecity.html';
});

document.getElementById("save-btn").addEventListener("click", function () {
  // Select the element you want to capture
  const targetElement = document.querySelector(".home-container"); 
  
  // Use html2canvas to capture the element
  html2canvas(targetElement).then((canvas) => {
    // convert the canvas to a downloadable image
    const link = document.createElement("a");
    link.download = "bridge-screenshot.png"; // Set the file name
    link.href = canvas.toDataURL("image/png"); // convert canvas to a PNG URL
    link.click(); // simulate a click to download the image
  });
});




// overall 
// make into anchors 


