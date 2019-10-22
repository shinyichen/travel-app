const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

const PORT = 8000;

/* setup app */
const app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

dotenv.config();
const DARKSKY_ENTPOINT = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}`;

/* start server */
const server = app.listen(PORT, ()=>{
    console.log(`Running on localhost: ${PORT}`);
});

/* index */
app.get("/", function(request, response) {
    response.sendFile("dist/index.html");
});

/* get weather forcast from darksky API */
app.post("/darksky", function(request, response) {
    const lat = request.body.lat;
    const lon = request.body.lon;
    const time = request.body.time;
    let url;
    if (time === undefined) {
        url = `${DARKSKY_ENTPOINT}/${lat},${lon}`;
    }
    else {
        url = encodeURI(`${DARKSKY_ENTPOINT}/${lat},${lon},${time}`);
    }
    console.log(url);
    fetch(url).then((res)=>{
        return res.json();
    })
    .then((res) => {
        const data = res.daily.data[0];
        response.json({
            summary: data.summary,
            highTemp: data.temperatureHigh,
            lowTemp: data.temperatureLow
        });
    });
});