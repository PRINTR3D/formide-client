app.controller('PrintjobController', ['$scope', 'Printjobs', '$route', function($scope, Printjobs, $route) {
	
	$scope.printjobs = [];
	
	$scope.init = function() {
		$scope.getPrintjobs();
	}
	
	$scope.getPrintjobs = function() {
		Printjobs.query(function(response) {
			$scope.printjobs = response;
			angular.forEach($scope.printjobs, function(value, key) {
				value.materials = JSON.parse(value.materials);
				value.sliceParams = JSON.parse(value.sliceParams);
				$scope.printjobs[key] = value;
			});
			console.log($scope.printjobs);
		});
	}
	
	$scope.deletePrintjob = function(printjobID) {
		if(confirm('Are you sure?')) {
			Printjobs.delete({ id: printjobID }, function(response) {
				$scope.getPrintjobs();
			});
		}
	}
	
	$scope.init();
	
}]);