app.controller('AuthController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', function($scope, $location, $window, UserService, AuthenticationService) {
	
	$scope.login = function(username, password) {
		if(username != undefined && password != undefined) {
			UserService.login(username, password).success(function(data) {
				AuthenticationService.isLogged = true;
				$window.sessionStorage.token = data.token;
				$location.path("/dashboard");
			}).error(function(status, data) {
				console.log(status);
				console.log(data);
			});
		}
	}
	
	$scope.logout = function() {
		if(AuthenticationService.isLogged) {
			AuthenticationService.isLogged = false;
			delete $window.sessionStorage.token;
			$location.path("/login");
		}
	}
	
}]);