var app = angular.module('printspotApp', ['ngRoute', 'ngResource', 'ngModal', 'btford.socket-io', 'growlNotifications', 'angularFileUpload']).
	config(['$routeProvider', '$locationProvider', '$httpProvider', 'ngModalDefaultsProvider', function($routeProvider, $locationProvider, $httpProvider, ngModalDefaultsProvider) {
		
		ngModalDefaultsProvider.set('closeButtonHtml', '<span class="octicon octicon-x"></span>');
		
		$httpProvider.interceptors.push('TokenInterceptor');
		
		$routeProvider
			.when('/slicing', {
				templateUrl: root_url + '/public/partials/sliceprofiles.html',
				controller: 'SliceprofileController',
				access: { requiredLogin: true }
			})
			.when('/apps', {
				templateUrl: root_url + '/public/partials/apps.html',
				controller: 'AppsController',
				access: { requiredLogin: true }
			})
			.when('/printjobs', {
				templateUrl: root_url + '/public/partials/printjobs.html',
				controller: 'PrintjobController',
				access: { requiredLogin: true }
			})
			.when('/printjobs/create/:id', {
				templateUrl: root_url + '/public/partials/createprintjob.html',
				controller: 'CreatePrintjobController',
				access: { requiredLogin: true }
			})
			.when('/files', {
				templateUrl: root_url + '/public/partials/files.html',
				controller: 'FileController',
				access: { requiredLogin: true }
			})
			.when('/materials', {
				templateUrl: root_url + '/public/partials/materials.html',
				controller: 'MaterialController',
				access: { requiredLogin: true }
			})
			.when('/printers', {
				templateUrl: root_url + '/public/partials/printers.html',
				controller: 'PrinterController',
				access: { requiredLogin: true }
			})
			.when('/settings', {
				templateUrl: root_url + '/public/partials/settings.html',
				controller: 'SettingsController',
				access: { requiredLogin: true }
			})
			.when('/testprinter', {
				templateUrl: root_url + '/public/partials/testprinter.html',
				controller: 'TestController',
				access: { requiredLogin: true }
			})
			.when('/login', {
				templateUrl: root_url + '/public/partials/login.html',
				controller: 'AuthController',
				access: { requiredLogin: false }
			})
			.when('/logout', {
	            templateUrl: root_url + '/public/partials/logout.html',
				controller: 'AuthController',
				access: { requiredLogin: true }
        	})
			.when('/', {
				templateUrl: root_url + '/public/partials/dashboard.html',
				controller: 'DashboardController',
				access: { requiredLogin: true }
			});
		
		$locationProvider.html5Mode(true);
}]);

/*
app.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if(next.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/login");
        }
    });
});
*/