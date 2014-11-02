app.factory('UserService', function($http) {
	return {
		login: function(username, password) {
			return $http.post(api_url + '/login', {username: username, password: password});
		},
		
		logout: function() {
			return $http.post(api_url + '/logout');
		},
		
		session: function() {
			return $http.post(api_url + '/session');
		}
	}
});