import { getCoord } from "./js/getCoordinate";
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

    // count the difference in days
    const daysAway = (travelDate.getTime() - today.getTime())/(1000*60*60*24);

    // get coordinate from city
    getCoord(city).then((coordRecord) => {
        if (coordRecord.status === "ok") {
            console.log(coordRecord);
            document.getElementById("countdown").innerHTML = daysAway;
            document.getElementById("city").innerHTML = coordRecord.name;
            document.getElementById("country").innerHTML = coordRecord.countryName;
            document.getElementById("lat").innerHTML = coordRecord.lat;
            document.getElementById("lon").innerHTML = coordRecord.lng;
        } else {
            console.log("invalid");
        }
    });
});

// export {
//     getCoord
// }