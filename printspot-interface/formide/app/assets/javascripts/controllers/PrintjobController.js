app.controller('PrintjobController', ['$scope', 'Printjobs', '$route', function($scope, Printjobs, $route) {
	
	$scope.printjobs = [];
	
	$scope.init = function() {
		$scope.getPrintjobs();
	}
	
	$scope.getPrintjobs = function() {
		Printjobs.query(function(response) {
			$scope.printjobs = response;
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