app.controller('CreatePrintjobController', ['$scope', '$routeParams', '$timeout', '$http', '$location', 'Sliceprofiles', 'Materials', 'Modelfiles', 'Printers', function($scope, $routeParams, $timeout, $http, $location, Sliceprofiles, Materials, Modelfiles, Printers) {
	
	$scope.sliceprofiles = [];
	$scope.materials = [];
	$scope.printers = [];
	
	$scope.selectedModelfile = null;
	$scope.selectedSliceprofile = null;
	$scope.selectedSlicemethod = 'offline';
	$scope.selectedMaterial = null;
	$scope.selectedPrinter = null;
    
	$scope.init = function() {
		$scope.getModelfile();
		$scope.getSliceprofiles();
		$scope.getMaterials();
		$scope.getPrinters();
	}
	
	$scope.getModelfile = function() {
		Modelfiles.get({ id: $routeParams.id }, function(response) {
			$scope.selectedModelfile = response;
			$timeout(function() {
				window.vc.setBackgroundColor(230, 230, 230);
				window.vc.addModel(0, response.hash, function(response) {
					window.vc.setModelColor(response.data.newId, 100, 100, 100);
				});
			});
		});
	}
	
	$scope.getSliceprofiles = function() {
		Sliceprofiles.query(function(response) {
			$scope.sliceprofiles = response;
		});
	}
	
	$scope.getMaterials = function() {
		Materials.query(function(response) {
			$scope.materials = response;
		});
	}
	
	$scope.getPrinters = function() {
		Printers.query(function(response) {
			$scope.printers = response;
		});
	}
	
	$scope.submit = function() {
		$http.post(api_url + '/slicing', {modelfile: $scope.selectedModelfile, sliceprofile: $scope.selectedSliceprofile, slicemethod: $scope.selectedSlicemethod, material: $scope.selectedMaterial, printer: $scope.selectedPrinter})
			.success(function(data, status, headers, config) {
				console.log(data);
				if(data == 'OK') {
					$location.path('/printjobs');
				}
				// this callback will be called asynchronously
				// when the response is available
  			}).
  			error(function(data, status, headers, config) {
	  			console.log(data);
  				// called asynchronously if an error occurs
  				// or server returns response with an error status.
  			});
	}
	
	$scope.init();
}]);