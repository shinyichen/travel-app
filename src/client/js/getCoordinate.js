async function getCoord(city) {

    const GEONAMES_ENDPOINT = "http://api.geonames.org/searchJSON?";
    const GEONAMES_USER = "shinyichen";
    const url = encodeURI(`${GEONAMES_ENDPOINT}q=${city}&maxRows=1&style=MEDIUM&lang=en&username=${GEONAMES_USER}`);
    const response = await fetch(url)
    if (response.status === 200) { 
        const data = await response.json();
        const record = data.geonames[0];
        record.status = "ok";
        return record;
    } else {
        return { status: "error" };
    }
}

export {
    getCoord
}