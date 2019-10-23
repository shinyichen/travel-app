import { getCoord, getWeather, getImage } from "./js/getCoordinate";
import "./styles/styles.scss";

document.getElementById("submitButton").addEventListener("click", function(event) {
    event.preventDefault();

    // today's date
    let today = new Date(Date.now());
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    // get user inputs
    const city = document.getElementById("cityInput").value;
    const startDate = document.getElementById("startDateInput").value;
    const endDate = document.getElementById("endDateInput").value;

    // get travel date
    const startDateSplit = startDate.split("-");
    const endDateSplit = endDate.split("-");
    let travelStartDate = new Date(startDateSplit[0], startDateSplit[1]-1, startDateSplit[2], 0, 0, 0, 0);
    let travelEndDate = new Date(endDateSplit[0], endDateSplit[1]-1, endDateSplit[2], 0, 0, 0, 0);

    // count the difference in days
    const daysAway = Math.floor((travelStartDate - today)/(1000*60*60*24));
    
    // trip length
    const travelLength = Math.floor((travelEndDate - travelStartDate)/(1000*60*60*24));

    // location
    let location;

    // get coordinate/weather from city
    getCoord(city).then((coordRecord) => {
        if (coordRecord.status === "ok") {
            document.getElementById("tripLength").innerHTML = travelLength;
            document.getElementById("countdown").innerHTML = daysAway;
            document.getElementById("city").innerHTML = coordRecord.name;
            document.getElementById("country").innerHTML = coordRecord.countryName;
            location = coordRecord.name;
            return [coordRecord.lat, coordRecord.lng];
        } else {
            console.log("get coord failed");
        }
    })
    .then((coord) => {
        // if trip is with in a week, get current forcast
        if (daysAway < 7) {
            return getWeather(coord[0], coord[1]);
        } else {
            return getWeather(coord[0], coord[1], travelStartDate.getTime()/1000);
        }
    }).then((weather) => {
        if (daysAway < 7) {
            document.getElementById("weatherTitle").innerHTML = `Current weather in ${location}`;
        } else {
            document.getElementById("weatherTitle").innerHTML = `Weather forcast in ${location}`;
        }
        document.getElementById("weatherSummary").innerHTML = weather.summary;
        document.getElementById("lowTemp").innerHTML = weather.lowTemp;
        document.getElementById("highTemp").innerHTML = weather.highTemp;

        // get city image
        return getImage(city);
    })
    .then((imageUrl) => {
        document.getElementById("cityImage").setAttribute("src", imageUrl);
        document.getElementById("result").classList.remove("hidden");
    });


});