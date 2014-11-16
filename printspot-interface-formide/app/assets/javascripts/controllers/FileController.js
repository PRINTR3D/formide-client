app.controller('FileController', ['$scope', '$upload', 'Modelfiles', function($scope, $upload, Modelfiles) {
	
	$scope.files = [];
	
	$scope.init = function() {
		$scope.getModelfiles();
	}
	
	$scope.onFileSelect = function($files) {
		for(var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: api_url + '/upload',
				method: 'POST',
				file: file
			}).progress(function(evt) {
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				console.log(data);
				$scope.getModelfiles();
			});
		}
	}
	
	$scope.getModelfiles = function() {
		Modelfiles.query(function(response) {
			$scope.files = response;
		});
	}
	
	$scope.deleteModelfile = function(modelfileID) {
		if(confirm('Are you sure?')) {
			Modelfiles.delete({ id: modelfileID }, function(response) {
				$scope.getModelfiles();
			});
		}
	}
	
	$scope.init();
	
}]);