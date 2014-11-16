app.controller('SliceprofileController', ['$scope', 'Sliceprofiles', '$routeParams', function($scope, Sliceprofiles, $routeParams) {
	
	$scope.sliceprofiles = [];
	$scope.activeSliceprofile = {};
	
	$scope.init = function() {
		$scope.getSliceprofiles();
		if($routeParams.active) {
			$scope.setActiveSliceprofile($routeParams.active);
			$scope.showUpdate();
		}
	}
	
	$scope.getSliceprofiles = function() {
		Sliceprofiles.query(function(response) {
			$scope.sliceprofiles = response;
		});
	}
	
	$scope.setActiveSliceprofile = function(sliceprofileID) {
		Sliceprofiles.get({ id: sliceprofileID }, function(response) {
			$scope.activeSliceprofile = response;
		});
	}
	
	$scope.createSliceprofile = function() {
		Sliceprofiles.create($scope.activeSliceprofile, function() {
			$scope.getSliceprofiles();
			$scope.hideCreate();
		});
	}
	
	$scope.updateSliceprofile = function() {
		Sliceprofiles.update($scope.activeSliceprofile, function() {
			$scope.getSliceprofiles();
			$scope.hideUpdate();
		});
	}
	
	$scope.deleteSliceprofile = function(sliceprofileID) {
		if(confirm('Are you sure?')) {
			Sliceprofiles.delete({ id: sliceprofileID }, function(response) {
				$scope.getSliceprofiles();
			});
		}
	}
	
	// create
	$scope.showCreate = function() {
		$('#createModal').modal('show');
		$scope.activeSliceprofile = {};
	}
	
	$scope.hideCreate = function() {
		$('#createModal').modal('hide');
	}
	
	// update
	$scope.showUpdate = function(sliceprofileID) {
		$('#updateModal').modal('show');
		$scope.setActiveSliceprofile(sliceprofileID);
	}
	
	$scope.hideUpdate = function() {
		$('#updateModal').modal('hide');
	}
	
	$scope.init();
	
}]);