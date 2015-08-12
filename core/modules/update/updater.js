var semver					= require('semver');
var fs						= require('fs');
var https					= require('https');
var AdmZip 					= require('adm-zip');
var async					= require('async');

//var pkg 					= require('../../package.json');
//var version 				= pkg.version;
var version 				= "0.1.0";
var newVersion 				= "0.1.1";
var downloadURL 			= "https://storage.googleapis.com/downloads.formide.com/formideos/updates/formideos-0.1.1.zip";
var downloadDestination 	= FormideOS.appRoot + "../update";
var installDestination		= FormideOS.appRoot;

function checkForUpdates(next) {
	if (semver.gt(newVersion, version)) {
		next(null, "Starting update");
		console.log("Newer version found: " + newVersion + ", dowloading update...");
		async.series([
			function(callback) {
				console.log('Downloading...');
				download(function(err, downloaded) {
					FormideOS.events.emit('update.progress1', downloaded);
					callback(null, downloaded);
				});
			},
			function(callback) {
				console.log('Validating...');
				validate(function(err, validated) {
					FormideOS.events.emit('update.progress2', validated);
					callback(null, validated);
				});
			},
			function(callback) {
				console.log('Installing...');
				install(function(err, installed) {
					FormideOS.events.emit('update.progress3', installed);
					callback(null, installed);
				});
			},
			function(callback) {
				console.log('Cleaning...');
				cleanup(function(err, cleanedup) {
					FormideOS.events.emit('update.progress4', cleanedup);
					callback(null, cleanedup);
				});
			}
		],
		function(err, results) {
			FormideOS.events.emit('update.finished', {
				steps: results,
				success: true,
				message: "Reboot your device to finish update"
			});
		});
	}
	else {
		next("No update neccesery, already running latest version");
		console.log("You already have the latest version: " + version);
	}
}

function download(next) {
	if (!fs.existsSync(downloadDestination)){
    	fs.mkdirSync(downloadDestination);
	}
	var updateFile = fs.createWriteStream(downloadDestination + "/" + newVersion + ".zip");
	var request = https.get(downloadURL, function (response) {
    	response.pipe(updateFile);
		updateFile.on("finish", function() {
			updateFile.close(function () {
				next(null, {
					stage: 'download',
					progress: 25,
					success: true,
					message: "Downloaded update, fetched " + updateFile.bytesWritten + " bytes"
				});
      		});
	    });
  	});
}

function validate(next) {
	// do some real validation
	setTimeout(function() {
		next(null, {
			stage: 'validate',
			progress: 50,
			success: true,
			message: "Validated downloaded updated. Safe to go!"
		});
	}, 3000);
}

function install(next) {
	var zip = new AdmZip(downloadDestination + "/" + newVersion + ".zip");
	//zip.extractAllTo(installDestination, true);
	next(null, {
		stage: 'install',
		progress: 75,
		success: true,
		message: "Installed update successfully"
	});
}

function cleanup(next) {
	fs.unlink(downloadDestination + "/" + newVersion + ".zip", function () {
		next(null, {
			stage: 'cleanup',
			progress: 100,
			success: true,
			message: "Cleaned up files used for updating"
		});
  	}.bind(this));
}

module.exports.update = checkForUpdates;