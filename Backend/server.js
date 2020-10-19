const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();

// Settings
const SERVER_PORT = 3001;

// Use cors
app.use(cors());

// Parse requests with content-type: application/json
app.use(bodyParser.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require("./routes/customer.routes")(app);
require("./routes/statistics.routes")(app);

app.listen(SERVER_PORT, () => {
	console.log("Server running on port " + SERVER_PORT);
});