app.controller('CreatePrintjobController', ['$scope', '$routeParams', '$timeout', '$http', '$location', 'Sliceprofiles', 'Materials', 'Modelfiles', 'Printers', function($scope, $routeParams, $timeout, $http, $location, Sliceprofiles, Materials, Modelfiles, Printers) {
	
	$scope.sliceprofiles = [];
	$scope.materials = [];
	$scope.printers = [];
	
	$scope.sliceParams = {};
	
	$scope.selectedModelfile = null;
	$scope.selectedSliceprofile = null;
	$scope.selectedSlicemethod = 'local';
	$scope.selectedMaterials = [];
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
			angular.forEach($scope.sliceprofiles, function(value, key) {
				value.settings = JSON.parse(value.settings);
				$scope.sliceprofiles[key] = value;
			});
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
			angular.forEach($scope.printers, function(value, key) {
				value.extruders = JSON.parse(value.extruders);
				$scope.printers[key] = value;
			});
		});
	}
	
	$scope.submit = function() {
		$scope.sliceParams = angular.copy($scope.selectedSliceprofile.settings);
		$scope.sliceParams.extruders = angular.copy($scope.selectedPrinter.extruders);
		angular.forEach($scope.sliceParams.extruders, function(value, key) {
			value.material = $scope.selectedMaterials[key].material.type;
			value.temperature = $scope.selectedMaterials[key].material.temperature;
			value.firstLayersTemperature = $scope.selectedMaterials[key].material.firstLayersTemperature;
			value.filamentDiameter = $scope.selectedMaterials[key].material.filamentDiameter;
			value.feedrate = $scope.selectedMaterials[key].material.feedrate;
			value.mode = $scope.selectedMaterials[key].mode;
			$scope.sliceParams.extruders[key] = value;
		});
		if($scope.selectedPrinter.bed) {
			$scope.sliceParams.bed = {
				"temperature": $scope.selectedMaterials[0].bedTemperature,
				"firstLayersTemperature": $scope.selectedMaterials[0].firstLayersBedTemperature
			};
		}
		$scope.sliceParams.model = $scope.selectedModelfile.hash;
		
		$http.post(api_url + '/slicing', {
			modelfile: $scope.selectedModelfile,
			sliceprofile: $scope.selectedSliceprofile,
			slicemethod: $scope.selectedSlicemethod,
			materials: $scope.selectedMaterials,
			printer: $scope.selectedPrinter,
			sliceparams: $scope.sliceParams
		}).success(function(data, status, headers, config) {
			if(data == 'OK') {
				$location.path('/printjobs');
			}
		}).error(function(data, status, headers, config) {
  			console.log(data);
		});
	}
	
	$scope.init();
}]);