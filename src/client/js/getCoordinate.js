function getCoord(event) {
    event.preventDefault();

    const GEONAMES_ENDPOINT = "http://api.geonames.org/searchJSON?";
    const GEONAMES_USER = "shinyichen";
    const city = document.getElementById("cityInput").value;
    const url = encodeURI(`${GEONAMES_ENDPOINT}q=${city}&maxRows=1&style=MEDIUM&lang=en&username=${GEONAMES_USER}`);
    fetch(url)
    .then((response) => {
        if (response.status === 200){ 
            response.json().then(data => {
                const record = data.geonames[0];
                document.getElementById("city").innerHTML = record.name;
                document.getElementById("country").innerHTML = record.countryName;
                document.getElementById("lat").innerHTML = record.lat;
                document.getElementById("lon").innerHTML = record.lng;
            })
        } else {
            console.log("error");
        }
        
    });
}

export {
    getCoord
}