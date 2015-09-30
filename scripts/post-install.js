var path = require('path');

// TODO: If it's an Element, move to /data (2nd partition)

SETUP = {
	storageDir: path.resolve(process.env.HOME + "/formideos") || path.resolve(process.env.USERPROFILE + "/formideos")
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

if (!fs.existsSync(SETUP.storageDir + "/tmp")){
	console.log("Tmp folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir + "/tmp");
}

if (!fs.existsSync(SETUP.storageDir + "/database")){
	console.log("Database folder not found, creating...");
	fs.mkdirSync(SETUP.storageDir + "/database");
	console.log("Running DB setup");
	require("./db-setup.js");
}