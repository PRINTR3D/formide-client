app.controller('MaterialController', ['$scope', 'Materials', '$routeParams', function($scope, Materials, $routeParams) {
	
	$scope.materials = [];
	$scope.activeMaterial = {};
	$scope.createModal = false;
	$scope.updateModal = false;
	
	$scope.init = function() {
		$scope.getMaterials();
		if($routeParams.active) {
			$scope.setActiveMaterial($routeParams.active);
			$scope.toggleUpdateModal();
		}
	}
	
	$scope.getMaterials = function() {
		Materials.query(function(response) {
			$scope.materials = response;
		});
	}
	
	$scope.setActiveMaterial = function(materialID) {
		Materials.get({ id: materialID }, function(response) {
			$scope.activeMaterial = response;
		});
	}
	
	$scope.createMaterial = function() {
		Materials.create($scope.activeMaterial, function() {
			$scope.getMaterials();
			$scope.toggleCreateModal();
		});
	}
	
	$scope.updateMaterial = function() {
		Materials.update($scope.activeMaterial, function() {
			$scope.getMaterials();
			$scope.toggleUpdateModal();
		});
	}
	
	$scope.deleteMaterial = function(materialID) {
		if(confirm('Are you sure?')) {
			Materials.delete({ id: materialID }, function(response) {
				$scope.getMaterials();
			});
		}
	}
	
	$scope.toggleCreateModal = function() {
		$scope.createModal = !$scope.createModal;
	};
	
	$scope.toggleUpdateModal = function(materialID) {
		if(!$scope.updateModal) {
			$scope.setActiveMaterial(materialID);
		}
		$scope.updateModal = !$scope.updateModal;
	};
	
	$scope.init();
	
}]);