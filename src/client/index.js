import { getCoord, getWeather } from "./js/getCoordinate";
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
    const date = document.getElementById("dateInput").value;

    // get travel date
    const dateSplit = date.split("-");
    let travelDate = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2], 0, 0, 0, 0);
    console.log(travelDate.toUTCString());

    // count the difference in days
    const daysAway = (travelDate.getTime() - today.getTime())/(1000*60*60*24);
    
    // get coordinate from city
    getCoord(city).then((coordRecord) => {
        if (coordRecord.status === "ok") {
            document.getElementById("countdown").innerHTML = daysAway;
            document.getElementById("city").innerHTML = coordRecord.name;
            document.getElementById("country").innerHTML = coordRecord.countryName;
            document.getElementById("lat").innerHTML = coordRecord.lat;
            document.getElementById("lon").innerHTML = coordRecord.lng;
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
            return getWeather(coord[0], coord[1], travelDate.getTime()/1000);
        }
    }).then((weather) => {
        document.getElementById("weatherSummary").innerHTML = weather.summary;
        document.getElementById("lowTemp").innerHTML = weather.lowTemp;
        document.getElementById("highTemp").innerHTML = weather.highTemp;
    });
});

// export {
//     getCoord
// }