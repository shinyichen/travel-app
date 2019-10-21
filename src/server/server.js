const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8000;

/* setup app */
const app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

/* start server */
const server = app.listen(PORT, ()=>{
    console.log(`Running on localhost: ${PORT}`);
});

/* index */
app.get("/", function(request, response) {
    response.sendFile("dist/index.html");
});