var app = angular.module('nectarApp', ['ngAnimate', 'ngRoute', 'angularFileUpload', 'ngResource', 'ngDialog', 'btford.socket-io', 'growlNotifications']).
	config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
		
		$httpProvider.interceptors.push('TokenInterceptor');
		
		$routeProvider
			.when('/login', {
				templateUrl: root_url + '/public/partials/login.html',
				controller: 'NectarController',
				access: { requiredLogin: false }
			})
			.when('/logout', {
	            templateUrl: root_url + '/public/partials/logout.html',
				controller: 'NectarController',
				access: { requiredLogin: true }
        	})
			.when('/', {
				templateUrl: root_url + '/public/partials/dashboard.html',
				controller: 'NectarController',
				access: { requiredLogin: true }
			});
		
		$locationProvider.html5Mode(true);
}]);

app.animation('.slide', function() {
    var NgHideClassName = 'ng-hide';
    return {
        beforeAddClass: function(element, className, done) {
            if(className === NgHideClassName) {
                jQuery(element).slideUp(done);
            }
        },
        removeClass: function(element, className, done) {
            if(className === NgHideClassName) {
                jQuery(element).hide().slideDown(done);
            }
        }
    }
});

/*
app.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if(next.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/login");
        }
    });
});
*/