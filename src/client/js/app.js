// make start date input start at today
let today;

function init() {
    today = new Date(Date.now());
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const todayString = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    document.getElementById("startDateInput").setAttribute("min", todayString);
    document.getElementById("endDateInput").setAttribute("min", todayString);
    return true;
}

function submitListener() {

    event.preventDefault();

    // clear results
    document.getElementById("errorSection").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");

    // get user inputs
    const city = document.getElementById("cityInput").value;
    const startDate = document.getElementById("startDateInput").value;
    const endDate = document.getElementById("endDateInput").value;

    // validate inputs
    if (city === "" || startDate === "" || endDate === "") {
        document.getElementById("errorSection").classList.remove("hidden");
        document.getElementById("errorMessage").innerHTML = "Destination and dates are required";
        return;
    } 

    // get travel date
    const startDateSplit = startDate.split("-");
    const endDateSplit = endDate.split("-");
    let travelStartDate = new Date(startDateSplit[0], startDateSplit[1]-1, startDateSplit[2], 0, 0, 0, 0);
    let travelEndDate = new Date(endDateSplit[0], endDateSplit[1]-1, endDateSplit[2], 0, 0, 0, 0);

    // validate date
    if (travelEndDate <= travelStartDate) {
        document.getElementById("errorSection").classList.remove("hidden");
        document.getElementById("errorMessage").innerHTML = "Travel end date must be after travel start date";
        return;
    }

    // count the difference in days
    const daysAway = Math.floor((travelStartDate - today)/(1000*60*60*24));
    
    // trip length
    const travelLength = Math.floor((travelEndDate - travelStartDate)/(1000*60*60*24));

    // location
    let destinationCity;
    let destinationCountry;

    // get coordinate/weather from city
    getCoord(city).then((coordRecord) => {
        document.getElementById("errorSection").classList.add("hidden");
        if (coordRecord.status === "ok") {
            destinationCity = coordRecord.name;
            destinationCountry = coordRecord.countryName;
            document.getElementById("destination").innerHTML = destinationCity + ", " + destinationCountry;
            document.getElementById("departure").innerHTML = startDate;
            document.getElementById("return").innerHTML = endDate;
            document.getElementById("tripLength").innerHTML = travelLength;
            document.getElementById("countdown").innerHTML = daysAway;
            return [coordRecord.lat, coordRecord.lng];
        } else {
            document.getElementById("errorSection").classList.remove("hidden");
            document.getElementById("errorMessage").innerHTML = coordRecord.message;
            return Promise.reject(coordRecord.message);
        }
    })
    .then((coord) => {
        // if trip is with in a week, get current forcast
        if (daysAway < 7) {
            return getWeather(coord[0], coord[1]);
        } else {
            return getWeather(coord[0], coord[1], travelStartDate.getTime()/1000);
        }
    }, (error)=> { // promise rejected due to error, do nothing
        return Promise.reject(error);
    }).then((weather) => {
        if (daysAway < 7) {
            document.getElementById("weatherTitle").innerHTML = `Current weather in ${destinationCity}, ${destinationCountry}`;
        } else {
            document.getElementById("weatherTitle").innerHTML = `Weather forcast in ${destinationCity}, ${destinationCountry}`;
        }
        document.getElementById("weatherSummary").innerHTML = weather.summary;
        document.getElementById("lowTemp").innerHTML = Math.round(weather.lowTemp) + "&deg;";
        document.getElementById("highTemp").innerHTML = Math.round(weather.highTemp) + "&deg;";

        // get city image
        return getImage(destinationCity, destinationCountry);
    }, (error) => {
        return Promise.reject(error);
    })
    .then((imageUrl) => {
        if (imageUrl !== null) {
            document.getElementById("cityImage").setAttribute("src", imageUrl);
        }
        document.getElementById("result").classList.remove("hidden");
    }, (error) => {
        console.log(error);
    });
}

async function getCoord(city) {

    const GEONAMES_ENDPOINT = "http://api.geonames.org/searchJSON?";
    const GEONAMES_USER = "shinyichen";
    const url = encodeURI(`${GEONAMES_ENDPOINT}q=${city}&maxRows=1&style=MEDIUM&lang=en&username=${GEONAMES_USER}`);
    const response = await fetch(url)
    const data = await response.json();
    if (data.totalResultsCount > 0) {
        const record = data.geonames[0];
        record.status = "ok";
        return record;
    } else {
        const record = {
            status: "error",
            message: "Destination is not valid"
        }
        return record;
    }
}

async function getWeather(lat, lon, time) {
    const url = "http://localhost:8000/darksky";
    const data = {
        lat: lat,
        lon: lon
    }
    if (time !== undefined) {
        data.time = time;
    }
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const weather = await response.json();
    return weather;
}

async function getImage(city, country) {
    let url = encodeURI(`http://localhost:8000/cityimage/${city}, ${country}`);
    let response = await fetch(url);
    let data = await response.json();
    if (data.status == "ok") {
        return data.imageUrl;
    } else {
        url = encodeURI(`http://localhost:8000/cityimage/${country}`);
        response = await fetch(url);
        data = await response.json();
        if (data.status == "ok") {
            return data.imageUrl;
        } else {
            return null;
        }
    }
    
}

export {
    init, submitListener
}