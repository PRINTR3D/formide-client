app.controller('NectarController', ['$scope', '$http', '$timeout', 'ngDialog', '$upload', 'Realtime', 'Modelfiles', 'Materials', 'Printjobs', 'Sliceprofiles', 'Printers', 'Queue', function($scope, $http, $timeout, ngDialog, $upload, Realtime, Modelfiles, Materials, Printjobs, Sliceprofiles, Printers, Queue) {
	
	var index = 0;
	
	$scope.selections = {};
	$scope.selections.selectedSlicemethod = 'local';
	$scope.sliceParams = {};
	$scope.interfaceSettings = {
		"extruders": {
			"a": {
				"mode": "build"
			},
			"b": {
				"mode": "support"
			}
		},
		"support": true
	};
	
	$scope.singlePrinterMode = true;
    $scope.notifications = [];
    
    $scope.modelfiles = [];
    $scope.selections.selectedModelfile = {};
    
    $scope.materials = [];
    $scope.selections.selectedMaterials =  [];
    
    $scope.sliceprofiles = [];
    $scope.selections.selectedSliceprofile = {};
   
    $scope.printers = [];
    $scope.selections.selectedPrinter = {};
    
    $scope.printjobs = [];
    $scope.queue = [];
    
    $scope.printerStatus = {};
    $scope.controlPrinter = {};

    $scope.movementVal = 10;
    $scope.extrudeVal = 10;
    $scope.retractVal = 10;

    $scope.init = function() {
		$scope.getModelfiles();
		$scope.getMaterials();
		$scope.getSliceprofiles();
		$scope.getPrintjobs();
		$scope.getQueue();
		$scope.getPrinters();
    };
    
    $scope.showNotification = function(msg) {
	    var i;
		i = index++;
		$scope.notifications[i] = msg;
    }
    
    $scope.getPrinters = function() {
	    Printers.query(function(response) {
			$scope.printers = response;
			angular.forEach($scope.printers, function(value, key) {
				value.extruders = JSON.parse(value.extruders);
				$scope.printers[key] = value;
			});
			if($scope.singlePrinterMode) {
		    	$scope.selectPrinter($scope.printers[0]);
	    	}
		});
	}
	
	$scope.selectPrinter = function(printer) {
		$scope.selections.selectedPrinter = printer;
	}
    
    $scope.getModelfiles = function() {
		Modelfiles.query(function(response) {
			$scope.modelfiles = response;
		});
    }
    
    $scope.getMaterials = function() {
		Materials.query(function(response) {
			$scope.materials = response;
		});
	}
    
    $scope.getSliceprofiles = function() {
		Sliceprofiles.query(function(response) {
			$scope.sliceprofiles = response;
			angular.forEach($scope.sliceprofiles, function(value, key) {
				value.settings = JSON.parse(value.settings);
				$scope.sliceprofiles[key] = value;
			});
		});
	}
    
    $scope.getPrintjobs = function() {
	    Printjobs.query(function(response) {
			$scope.printjobs = response;
		});
    }
    
    $scope.getQueue = function() {
	    Queue.query(function(response) {
		 	$scope.queue = response;
		 	angular.forEach($scope.queue, function(value, key) {
			 	var printjob = Printjobs.get({id: value.printjobID}, function() {
				 	var modelfile = Modelfiles.get({id: printjob.modelfileID}, function() {
					 	printjob.modelfile = modelfile;
				 	});
				 	value.slicedata = JSON.parse(value.slicedata);
				 	value.printjob = printjob;
				 	$scope.queue[key] = value;
			 	});
		 	});
	    });
    }
    
    $scope.removeFromQueue = function(id) {
	    Queue.delete({id: id}, function() {
			$scope.getQueue();
	    });
    }
    
    $scope.switchChannels = function() {
	    if($scope.interfaceSettings.extruders.a.mode == 'build') {
		    $scope.interfaceSettings.extruders.a.mode = 'support';
		    $scope.interfaceSettings.extruders.b.mode = 'build';
	    }
	    else {
		    $scope.interfaceSettings.extruders.a.mode = 'build';
		    $scope.interfaceSettings.extruders.b.mode = 'support';
	    }
    }
    
    $scope.saveSelectedSliceprofile = function() {
	    
    }

    $scope.onFileSelect = function($files) {
	    $scope.showNotification('Uploading files');
	    for(var i = 0; i < $files.length; i++) {
		    var file = $files[i];
			$scope.upload = $upload.upload({
				url: api_url + '/upload',
				method: 'POST',
				file: file
			}).progress(function(evt) {
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				$scope.showNotification('Files uploaded');
				$scope.getModelfiles();
			});
		}
    };

    $scope.selectAside = function(item) {
        if($scope.selection == item) {
            $scope.selection = false;
        }
        else {
            $scope.selection = item;
        }
    };

    $scope.contentModule = false;
    $scope.selectContentModule = function(item) {
        if($scope.contentModule == item) {
            $scope.contentModule = false;
        }
        else {
            $scope.contentModule = item;
        }
    };

    $scope.selectedTask = false;
    $scope.selectTaskItem = function(id) {
        if($scope.selectedTask == id) {
            $scope.selectedTask = false;
        }
        else {
            $scope.selectedTask = id;
        }
    };

    $scope.bottomTooltip = false;
    $scope.selectBottomTooltip = function(item) {
        if($scope.bottomTooltip == item) {
            $scope.bottomTooltip = false;
        }
        else {
            $scope.bottomTooltip = item;
        }
    };
    
    $scope.slice = function() {
	    
	    $scope.showNotification('Slicing...');
	    
		$scope.sliceParams = angular.copy($scope.selections.selectedSliceprofile.settings);
		$scope.sliceParams.extruders = angular.copy($scope.selections.selectedPrinter.extruders);
		angular.forEach($scope.sliceParams.extruders, function(value, key) {
			value.material = $scope.printerStatus.extruders[key].material.type;
			value.temperature = $scope.printerStatus.extruders[key].material.temperature;
			value.firstLayersTemperature = $scope.printerStatus.extruders[key].material.firstLayersTemperature;
			value.filamentDiameter = $scope.printerStatus.extruders[key].material.diameter;
			value.feedrate = $scope.printerStatus.extruders[key].material.feedrate;
			if(key == 0) {
				value.mode = $scope.interfaceSettings.extruders.a.mode;
			}
			else if(key == 1) {
				value.mode = $scope.interfaceSettings.extruders.b.mode;
			}
			$scope.sliceParams.extruders[key] = value;
		});
		if($scope.selections.selectedPrinter.bed) {
			$scope.sliceParams.bed = {
				"temperature": $scope.printerStatus.extruders[0].material.bedTemperature,
				"firstLayersTemperature": $scope.printerStatus.extruders[0].material.firstLayersBedTemperature
			};
		}
		if($scope.interfaceSettings.support == false) {
			delete $scope.sliceParams.support;
		}
		$scope.sliceParams.model = $scope.selections.selectedModelfile.hash;
		
		$http.post(api_url + '/slicing', {
			modelfile: $scope.selections.selectedModelfile,
			sliceprofile: $scope.selections.selectedSliceprofile,
			slicemethod: $scope.selections.selectedSlicemethod,
			materials: $scope.printerStatus.extruders,
			printer: $scope.selections.selectedPrinter,
			sliceparams: $scope.sliceParams
		}).success(function(data, status, headers, config) {
			if(data == 'OK') {
				$scope.showNotification('Done slicing');
				$scope.getPrintjobs();
				$scope.getQueue();
			}
		}).error(function(data, status, headers, config) {
  			console.log(data);
		});
	}
	
	$scope.startPrint = function(queueitemID, gcodeHash) {
		if(confirm('Is the printbead cleared?')) {
			$scope.controlPrinter.start(queueitemID, gcodeHash);
		}
	}

    $scope.selectFile = function() {
        $scope.preview($scope.selections.selectedModelfile);
        $scope.selectAside('slice');
    };

    $scope.preview = function(modelfile) {
	    $scope.contentModule = 'printerPreview';
    	CFInstall.check({
	        mode: "inline",
	        node: "prompt"
		});
		thingiurlbase = "/public/assets/javascripts";
		thingiview = new Thingiview("viewer");
		thingiview.setObjectColor('#C0D8F0');
		thingiview.setBackgroundColor('#f1f1f1');
		thingiview.initScene();
		//thingiview.setShowPlane(true);
		thingiview.loadSTL(api_url + '/download?hash=' + modelfile.hash + '&encoding=false');
    };
    
    /*
	 * Update the dashboard
	 */
	$scope.updateDashboard = function(data) {
		$scope.printerStatus = data;
		
		$scope.printerStatus.extrudera = data.extruders[0];
		$scope.printerStatus.extrudera.material = $scope.materials[$scope.printerStatus.extrudera.filament.material];
		$scope.printerStatus.extrudera.colorString = 'rgb('+$scope.printerStatus.extrudera.filament.red+','+$scope.printerStatus.extrudera.filament.green+','+$scope.printerStatus.extrudera.filament.blue+')';
		$scope.printerStatus.extrudera.statusHeight = Math.round(24 * ($scope.printerStatus.extrudera.filament.currentLength / $scope.printerStatus.extrudera.filament.totalLength));
		$scope.printerStatus.extrudera.percentage = Math.round(100 * ($scope.printerStatus.extrudera.filament.currentLength / $scope.printerStatus.extrudera.filament.totalLength));
		
		$scope.printerStatus.extruderb = data.extruders[1];
		$scope.printerStatus.extruderb.material = $scope.materials[$scope.printerStatus.extruderb.filament.material];
		$scope.printerStatus.extruderb.colorString = 'rgb('+$scope.printerStatus.extruderb.filament.red+','+$scope.printerStatus.extruderb.filament.green+','+$scope.printerStatus.extruderb.filament.blue+')';
		$scope.printerStatus.extruderb.statusHeight = Math.round(24 * ($scope.printerStatus.extruderb.filament.currentLength / $scope.printerStatus.extruderb.filament.totalLength));
		$scope.printerStatus.extruderb.percentage = Math.round(100 * ($scope.printerStatus.extruderb.filament.currentLength / $scope.printerStatus.extruderb.filament.totalLength));

		$scope.$apply();
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
			dist: parseFloat(dist)
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
	$scope.controlPrinter.start = function(queueitemID, gcodeHash) {
		$scope.pushToPrinter('dashboard_push_printer_start', {
			printjobID: queueitemID,
			hash: gcodeHash
		});
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
	 * Receive printer status
	 */
	Realtime.on('client_push_printer_status', function(data) {
		$scope.updateDashboard(data);
	});
	
	/*
	 * Receive printer error
	 */
	Realtime.on('client_push_printer_error', function(data) {
		$scope.showNotification('Error: ' + data);
	});
	
	/*
	 * Receive printer connect message
	 */
	Realtime.on('client_push_printer_connect', function(data) {
		$scope.showNotification('Printer connected');
	});
	
	/*
	 * Receive printer disconnect message
	 */
	Realtime.on('client_push_printer_disconnect', function(data) {
		$scope.showNotification('Printer disconnected');
	});
	
	/*
	 * Receive printer finished message
	 */
	Realtime.on('client_push_printer_finished', function(data) {
		$scope.showNotification('Printer finished printing');
	});
	
	/*
	 * Call init function
	 */
	$scope.init();;
}]);
