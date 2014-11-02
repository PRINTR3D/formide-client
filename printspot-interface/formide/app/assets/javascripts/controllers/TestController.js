app.controller('TestController', ['$scope', 'Realtime', '$interval', function($scope, Realtime, $interval) {
	
	statusUpdate = $interval(function() {
		Realtime.emit('client_push_printer_status', {
			printerID: 	'local',
			status: 	'heating',
			etemp:		Math.random() * 300,
			tetemp:		200,
			e1temp:		Math.random() * 300,
			te1temp:	200,
			btemp:		Math.random() * 50,
			tbempt:		50
		});
    }, 2000);
    
    $scope.connect = function() {
	    Realtime.emit('client_push_printer_connect', {
		    'printerID': 'local'
	    });
    }
    
    $scope.disconnect = function() {
	    Realtime.emit('client_push_printer_disconnect', {
		    'printerID': 'local'
	    });
    }
    
    $scope.finished = function() {
	    Realtime.emit('client_push_printer_finished', {
		    'printerID': 'local'
	    });
    }
	
}]);