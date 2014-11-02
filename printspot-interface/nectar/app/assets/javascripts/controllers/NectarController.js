app.controller('NectarController', ['$scope', '$http', '$timeout', 'ngDialog', '$upload', 'Realtime', 'Modelfiles', 'Materials', 'Printjobs', 'Sliceprofiles', function($scope, $http, $timeout, ngDialog, $upload, Realtime, Modelfiles, Materials, Printjobs, Sliceprofiles) {
	
	var index = 0;
	
    $scope.notifications = []; 
    $scope.modelfiles = [];
    $scope.materials = [];
    $scope.sliceprofiles = [];
    $scope.printjobs = [];
    $scope.printer = {};
    $scope.printerStatus = {};
    $scope.controlPrinter = {};
    $scope.sliceform = {};

    $scope.movementVal = 10;
    $scope.extrudeVal = 10;
    $scope.retractVal = 10;

    $scope.init = function() {
		$scope.getModelfiles();
		$scope.getMaterials();
		$scope.getSliceprofiles();
		$scope.getPrintjobs();
    };
    
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
		});
    }
    
    $scope.getPrintjobs = function() {
	    Printjobs.query(function(response) {
			$scope.printjobs = response;
		});
    }

    $scope.onFileSelect = function($files) {
	    for(var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: '/upload',
				method: 'POST',
				file: file
			}).progress(function(evt) {
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				console.log(data);
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

    /*
$scope.selectPrinterSection = function(id, item) {
        if($scope.printerSelection[id].selection == item) {
            $scope.printerSelection[id].selection = false;
        }
        else {
            if(item == 'queue') {
                dataService.get(api_url + config.endpoints.queue.printer + '/' + id).then(function(data) {
                    $scope.printerSelection[id].queue = data;
                });
            }
            else if(item == 'archive') {

            }
            $scope.printerSelection[id].selection = item;
        }
    };
*/

    $scope.deletePrintjob = function(id, printerID) {
        /*
dataService.post(api_url + config.endpoints.queue.delete + '/' + id).then(function(data) {
            dataService.get(api_url + config.endpoints.queue.printer + '/' + printerID).then(function(data) {
                console.log(data);
                $scope.printerSelection[printerID].queue = data;
                $scope.apply();
            });
            dataService.get(api_url + config.endpoints.archive.printer + '/' + printerID).then(function(data) {
                $scope.printerSelection[printerID].archive = data;
            });
        });
*/
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
       /*
 $scope.notification.title = "Added to queue";
        $scope.notification.visible = true;

        $timeout(function() {
            $scope.notification.visible = false;
        }, 2000);

        $scope.sliceform.printer = $scope.activePrinter.id;
        $scope.sliceform.material = 1;

        dataService.post(api_url + config.endpoints.queue.create +'?modelfileID='+$scope.sliceform.modelfile+'&materialID='+$scope.sliceform.material+'&printerID='+$scope.sliceform.printer+'&sliceprofileID='+$scope.sliceform.sliceprofile).then(function(data) {
        	if(data.success == true) {
                dataService.get(api_url + config.endpoints.queue.active).then(function(data) {
                    $scope.activePrinterQueue = data;
                });
            }
            else {
            	$scope.notification.title = data.error;
                $scope.notification.visible = true;

                $timeout(function() {
                    $scope.notification.visible = false;
                }, 2000);
            }
        });
*/
    };

    $scope.activeEdit = {};

    $scope.removeFilament = function () {
        // ngDialog.open({ template: 'removeFilamentTemplate' });
    };

    $scope.initThingiview = function() {
       //  $scope.thingiview = new Thingiview("viewer");
    };

    $scope.selectFile = function() {
        //$scope.preview($scope.sliceform.modelfile);
        $scope.selectAside('slice');
    };

    $scope.preview = function(id) {
        /*
// var modelfileName = getUrlVars()['stl'];
        // $scope.addForm['modelfile'] = modelfileName;
        $scope.contentModule = 'printerPreview';
        // You may want to place these lines inside an onload handler
        CFInstall.check({
             mode: "inline", // the default
             node: "prompt"
        });
        
        dataService.get(api_url + config.endpoints.modelfiles.single + '/' + id).then(function(data) {
            $scope.initThingiview();
			$scope.thingiview.setBackgroundColor('#f1f1f1');
			$scope.thingiview.initScene();
			$scope.thingiview.loadSTL(data.data.name);
			$scope.thingiview.setRotation(false);
        });
*/
    };
    
    /*
	 * Update the dashboard
	 */
	$scope.updateDashboard = function(data) {
		$scope.printerStatus = data;
        if(data.filamenta != "") {
            $scope.printerStatus.filamenta.material = $scope.filaments[data.filamenta.material];
            $scope.printerStatus.filamenta.colorString = 'rgb('+data.filamenta.red+','+data.filamenta.green+','+data.filamenta.blue+')';
            $scope.printerStatus.filamenta.statusHeight = Math.round(24 * (data.filamenta.currentLength / data.filamenta.totalLength));
            $scope.printerStatus.filamenta.percentage = Math.round(100 * (data.filamenta.currentLength / data.filamenta.totalLength));
        }
        if(data.filamentb != "") {
            $scope.printerStatus.filamentb.material = $scope.filaments[data.filamentb.material];
            $scope.printerStatus.filamentb.colorString = 'rgb('+data.filamentb.red+','+data.filamentb.green+','+data.filamentb.blue+')';
            $scope.printerStatus.filamentb.statusHeight = Math.round(24 * (data.filamentb.currentLength / data.filamentb.totalLength));
            $scope.printerStatus.filamentb.percentage = Math.round(100 * (data.filamentb.currentLength / data.filamentb.totalLength));
        }
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
			printjobOrigin: 'local',
			printjobID: printjobID,
			hash: hash
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
		var i;
		i = index++;
		$scope.notifications[i] = 'Error: ' + data;
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
	$scope.init();;
}]);
