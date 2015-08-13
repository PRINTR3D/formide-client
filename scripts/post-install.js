SETUP = {
	dbLocation: "storage/database"
};

var fs = require('fs');

// create needed folders
if (!fs.existsSync("storage")){
	console.log("Storage folder not found, creating...");
	fs.mkdirSync("storage");
}

if (!fs.existsSync("storage/modelfiles")){
	console.log("Modelfiles folder not found, creating...");
	fs.mkdirSync("storage/modelfiles");
}

if (!fs.existsSync("storage/gcode")){
	console.log("Gcode folder not found, creating...");
	fs.mkdirSync("storage/gcode");
}

if (!fs.existsSync("storage/tmp")){
	console.log("Tmp folder not found, creating...");
	fs.mkdirSync("storage/tmp");
}

if (!fs.existsSync("storage/database")){
	console.log("Database folder not found, creating...");
	fs.mkdirSync("storage/database");
	console.log("Running DB setup");
	require("./db-setup.js");
}