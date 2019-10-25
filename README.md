# Udacity Front End Capstone - Travel App
The app allows user to enter a destination and travel dates, and displays the information about the travel.

## Setup
### Install dependencies
`npm install`

### Start server
`npm run server`

### Build app in dev mode
`npm run build-dev`

### Build app in production mode
`npm run build-prod`

## Code
The app entry point is `client/index.js`.
Client code is located in `client/js/app.js`, which defines client initializations and listener. When user submits inputs, the listener calls the server to get the coordinate (Geonames API), the image of the location (Pixabay API), then uses the coordinate to get the weather (Dark Sky API). The actual API calls for Pixabay and Dark Sky are handled on the server to protect the API keys.