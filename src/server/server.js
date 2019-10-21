const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8000;

/* setup app */
const app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("../client"));

/* start server */
const server = app.listen(PORT, ()=>{
    console.log(`Running on localhost: ${PORT}`);
});

/* index */
app.get("/", function(request, response) {
    response.send("index");
});

/* get coordinate from zip code using Geonames API */
app.get("/coord", function(request, response) {

});

/* get weather forcase from coord and date using Dark sky API */
app.get("/weather", function(request, response) {

});

/* get location image from zip using Pixabay API */
app.get("/locimage", function(request, response) {

});