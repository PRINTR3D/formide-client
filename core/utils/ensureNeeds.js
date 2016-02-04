const path			= require('path');
const fs			= require('fs');
const storageDir	= FormideOS.config.get('app.storageDir');
const logDir		= path.join(FormideOS.config.get('app.storageDir'), 'logs');
const filesDir		= path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.modelfiles'));
const gcodeDir		= path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.gcode'));
const imageDir		= path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.images'));

// create needed folders
if (!fs.existsSync(storageDir)) {
	console.log("Storage folder not found, creating...");
	fs.mkdirSync(storageDir);
}

if (!fs.existsSync(logDir)){
	console.log("Logs folder not found, creating...");
	fs.mkdirSync(logDir);
}

if (!fs.existsSync(filesDir)){
	console.log("Modelfiles folder not found, creating...");
	fs.mkdirSync(filesDir);
}

if (!fs.existsSync(gcodeDir)){
	console.log("Gcode folder not found, creating...");
	fs.mkdirSync(gcodeDir);
}

if (!fs.existsSync(imageDir)){
	console.log("Image folder not found, creating...");
	fs.mkdirSync(imageDir);
}
