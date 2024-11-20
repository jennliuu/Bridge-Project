function validateAndFormatTime(hour, minute, ampm) {
    if (!hour || !minute || !ampm) return null;
  
    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);
  
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')} ${ampm}`;
  }
  
  function submitTimes() {
    const baseStart = validateAndFormatTime(
      document.getElementById("base-hour-start").value,
      document.getElementById("base-minute-start").value,
      document.getElementById("base-ampm-start").value
    );
    const baseEnd = validateAndFormatTime(
      document.getElementById("base-hour-end").value,
      document.getElementById("base-minute-end").value,
      document.getElementById("base-ampm-end").value
    );
  
    const nycStart = validateAndFormatTime(
      document.getElementById("nyc-hour-start").value,
      document.getElementById("nyc-minute-start").value,
      document.getElementById("nyc-ampm-start").value
    );
    const nycEnd = validateAndFormatTime(
      document.getElementById("nyc-hour-end").value,
      document.getElementById("nyc-minute-end").value,
      document.getElementById("nyc-ampm-end").value
    );
  
    const londonStart = validateAndFormatTime(
      document.getElementById("london-hour-start").value,
      document.getElementById("london-minute-start").value,
      document.getElementById("london-ampm-start").value
    );
    const londonEnd = validateAndFormatTime(
      document.getElementById("london-hour-end").value,
      document.getElementById("london-minute-end").value,
      document.getElementById("london-ampm-end").value
    );
  
    if (!baseStart || !baseEnd || !nycStart || !nycEnd || !londonStart || !londonEnd) {
      alert("Please ensure all times are correctly entered.");
      return;
    }
  
    const availabilities = {
      baseCity: { start: baseStart, end: baseEnd },
      otherCities: [
        { city: "New York City, NY", start: nycStart, end: nycEnd },
        { city: "London, UK", start: londonStart, end: londonEnd },
      ],
    };
  
    console.log("Submitted Availabilities:", availabilities);
    alert("Your times have been recorded!");
  }