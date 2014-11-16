app.controller('DashboardController', ['$scope', 'Printjobs', 'Realtime', function($scope, Printjobs, Realtime) {
	
	var index = 0;
	
	// Declare variables
	$scope.printjobs = [
		{
			duration_estimate: "2hrs 3mins",
			modelfile: {
				name: "File1"
			},
			sliceprofile: {
				name: "High detail"
			},
			material: {
				type: "PLA",
				color: "#59F394"
			}
		}
	];
	$scope.notifications = {};
	$scope.controlVariables = {};
	$scope.printerStatus = {};
	$scope.controlPrinter = {};
	
	$scope.controlVariables.movement = 10;
	$scope.controlVariables.extrude = 10;
	$scope.controlVariables.retract = 10;
	$scope.controlVariables.ext0temp = 200;
	$scope.controlVariables.ext1temp = 200;
	$scope.controlVariables.bedtemp = 50;
	
	$scope.getNavbarItemClass = function (path) {
      	if ($location.path().substr(0, path.length) == path) {
		  	return "active";
		}
    };
	
	$scope.init = function() {
		$scope.getActivePrintjob();
		ext0.refresh(Math.floor($scope.controlVariables.ext0temp));
		bed.refresh(Math.floor($scope.controlVariables.bedtemp));
	}
	
	/*
	 * Get active printjob
	 */
	$scope.getActivePrintjob = function() {
		
	}
	
	/*
	 * Update the dashboard
	 */
	$scope.updateDashboard = function() {
		ext0.refresh(Math.floor($scope.printerStatus.etemp));
		bed.refresh(Math.floor($scope.printerStatus.btemp));
	}
	
	/*
	 * Push to printer with channel and data
	 */
	$scope.pushToPrinter = function(channel, data) {
		Realtime.emit(channel, data);
	}
	
	/*
	 * Push a gcode function to the printer
	 */
	$scope.controlPrinter.gcode = function() {
		$scope.pushToPrinter('dashboard_push_printer_gcode', {
			code: gcode
		});
	}
	
	/*
	 * Push move printhead message to printer
	 */
	$scope.controlPrinter.move = function(axis, dist, distmode) {
		$scope.pushToPrinter('dashboard_push_printer_jog', {
			axis: axis,
			dist: parseFloat(dist),
			distmode: distmode
		});
	}
	
	/*
	 * Push extruder temperature message to printer
	 */
	$scope.controlPrinter.extruderTemperature = function(temp, extnr) {
		$scope.pushToPrinter('dashboard_push_printer_temp_ext', {
			temp: parseInt(temp),
			extnr: extnr
		});
	}
	
	/*
	 * Push bed temperature message to printer
	 */
	$scope.controlPrinter.bedTemperature = function(temp) {
		$scope.pushToPrinter('dashboard_push_printer_temp_bed', {
			temp: parseInt(temp)
		});
	}
	
	/*
	 * Push manual extrude message to printer
	 */
	$scope.controlPrinter.extrude = function(dist, extrn) {
		$scope.pushToPrinter('dashboard_push_printer_extrude', {
			dist: parseFloat(dist),
			extnr: extrn
		});
	}
	
	/*
	 * Push manual retract message to printer
	 */
	$scope.controlPrinter.retract = function(dist, extnr) {
		$scope.pushToPrinter('dashboard_push_printer_retract', {
			dist: parseFloat(dist),
			extnr: extnr
		});
	}
	
	/*
	 * Push home printhead message to printer
	 */
	$scope.controlPrinter.home = function() {
		$scope.pushToPrinter('dashboard_push_printer_home', {});
	}
	
	/*
	 * Push park printhead message to printer
	 */
	$scope.controlPrinter.park = function() {
		$scope.pushToPrinter('dashboard_push_printer_park', {});
	}
	
	/*
	 * Push start printjob message to printer
	 */
	$scope.controlPrinter.start = function() {
		$scope.pushToPrinter('dashboard_push_printer_start', {});
	}
	
	/*
	 * Push pause printjob message to printer
	 */
	$scope.controlPrinter.pause = function() {
		$scope.pushToPrinter('dashboard_push_printer_pause', {});
	}
	
	/*
	 * Push resume printjob message to printer
	 */
	$scope.controlPrinter.resume = function() {
		$scope.pushToPrinter('dashboard_push_printer_resume', {});
	}
	
	/*
	 * Push stop printjob message to printer
	 */
	$scope.controlPrinter.stop = function() {
		$scope.pushToPrinter('dashboard_push_printer_stop', {});
	}
	
	/*
	 * Push stop all motors message to printer
	 */
	$scope.controlPrinter.stopAll = function() {
		$scope.pushToPrinter('dashboard_push_printer_stop_all', {});
	}
	
	/*
	 * Push autolevel printbed message to printer
	 */
	$scope.controlPrinter.autoLevel = function() {
		$scope.pushToPrinter('dashboard_push_printer_autolevel', {});
	}
	
	/*
	 * Push reconnect message to printer
	 */
	$scope.controlPrinter.reconnect = function() {
		$scope.pushToPrinter('dashboard_push_printer_reconnect', {});
	}
	
	/*
	 * Push fan speed message to printer
	 */
	$scope.controlPrinter.fan = function(speed, fannr) {
		$scope.pushToPrinter('dashboard_push_printer_fan', {
			fannr: fannr,
			speed: speed
		});
	}
	
	/*
	 * Push LCD message to printer
	 */
	$scope.controlPrinter.LCD = function(message) {
		$scope.pushToPrinter('dashboard_push_printer_lcd_message', {
			message: message
		});
	}
	
	/*
	 * Push printjob gcode to printer
	 */
	$scope.controlPrinter.printjob = function(printjobID, hash) {
		$scope.pushToPrinter('dashboard_push_printer_printjob', {
			type: 'local',
			printjobID: printjobID,
			hash: hash
		});
	}
	
	/*
	 * Receive printer status
	 */
	Realtime.on('client_push_printer_status', function(data) {
		$scope.printerStatus = data;
		$scope.updateDashboard();
	});
	
	/*
	 * Receive printer connect message
	 */
	Realtime.on('client_push_printer_connect', function(data) {
		var i;
		i = index++;
		$scope.notifications[i] = 'Printer connected';
	});
	
	/*
	 * Receive printer disconnect message
	 */
	Realtime.on('client_push_printer_disconnect', function(data) {
		var i;
		i = index++;
		$scope.notifications[i] = 'Printer disconnected';
	});
	
	/*
	 * Receive printer finished message
	 */
	Realtime.on('client_push_printer_finished', function(data) {
		var i;
		i = index++;
		$scope.notifications[i] = 'Printer finished printing';
	});
	
	/*
	 * Call init function
	 */
	$scope.init();
	
}]);