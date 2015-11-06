var path = require('path');

SETUP = {
	storageDir: path.resolve(process.env.HOME + "/formide") || path.resolve(process.env.USERPROFILE + "/formide")
};

var fs = require('fs');

// create needed folders
if (!fs.existsSync(SETUP.storageDir)){
	console.log("Storage folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir);
}

if (!fs.existsSync(SETUP.storageDir + "/logs")){
	console.log("Logs folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir + "/logs");
}

if (!fs.existsSync(SETUP.storageDir + "/modelfiles")){
	console.log("Modelfiles folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir + "/modelfiles");
}

if (!fs.existsSync(SETUP.storageDir + "/gcode")){
	console.log("Gcode folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir + "/gcode");
}

console.log("Running DB setup");
require("./db-setup.js");