app.controller('SettingsController', ['$scope', '$route', 'Settings', function($scope, $route, Settings) {
	
	$scope.userSettings = {};
	$scope.networkSettings = {};
	
	$scope.init = function() {
		$scope.getSettings();
	}
	
	$scope.getSettings = function() {
		Settings.query(function(response) {
			console.log(response);
			$scope.networkSettings = response;
		});
	}
	
	$scope.saveUserSettings = function() {
		
	}
	
	$scope.saveNetworkSettings = function() {
		
	}
	
	$scope.init();
	
}]);