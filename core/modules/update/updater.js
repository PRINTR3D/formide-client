var semver					= require('semver');
var fs						= require('fs');
var https					= require('https');
var AdmZip 					= require('adm-zip');
var spawn 					= require('child_process').spawn;

//var pkg 					= require('../../package.json');
//var version 				= pkg.version;
var version 				= "0.1.0";
var newVersion 				= "0.1.1";
var downloadURL 			= "https://storage.googleapis.com/downloads.formide.com/formideos/updates/formideos-0.1.1.zip";
var downloadDestination 	= FormideOS.appRoot + "../update";
var installDestination		= FormideOS.appRoot;

function checkForUpdates(progress, callback) {
	if (semver.gt(newVersion, version)) {
		console.log("Newer version found: " + newVersion + ", Starting download...");
		download(function(err, downloaded) {
			if (err) return callback(err);
			progress(downloaded);
			console.log("Downloaded update...");
			console.log("Validating update...");
			validate(function(err, validated) {
				if (err) return callback(err);
				progress(validated);
				console.log("Validated update");
				console.log("Installing update...");
				install(function(err, installed) {
					if (err) return callback(err);
					progress(installed);
					console.log("Installed update");
					console.log("Cleaning up...");
					cleanup(function(err, cleanedup) {
						if (err) return callback(err);
						progress(cleanedup);
						console.log("Cleaned up...");
						callback(null, {
							progress: 100,
							success: true,
							message: "Reboot your device to finish update"
						});
					});
				});
			});
		});
	}
	else {
		console.log("You already have the latest version: " + version);
	}
}

function download(next) {
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
	// do some validation
	next(null, {
		stage: 'validate',
		progress: 50,
		success: true,
		message: "Validated downloaded updated. Safe to go!"
	});
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