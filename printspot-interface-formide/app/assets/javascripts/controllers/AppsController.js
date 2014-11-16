app.controller('AppsController', ['$scope', function($scope) {
	
	$scope.apps = [];
	$scope.activeApp = {};
	
	$scope.init = function() {
		$scope.getApps();
	}
	
	$scope.getApps = function() {
		$scope.apps = [
			{
				name: 'Color Mixer',
				description: 'This unique color mixing tool created by Builder3D (3Dprinter4u.com) allows you to create bueautiful color changing shapes on the Builder Mono, Builder Dual and Big Builder 3D printers.',
				image: '/public/assets/images/rose.jpg',
				url: 'http://formide.local/apps/1'
			},
			{
				name: 'Large Vase Generator',
				description: 'Create unique vases. Choose the shape, height and put your name on it!',
				image: '/public/assets/images/vase.jpg',
				url: 'http://formide.local/apps/2'
			}
		];
	}
	
	// app
	$scope.showApp = function(id) {
		$('#appModal').modal('show');
		$scope.activeApp = $scope.apps[id];
	}
	
	$scope.hideApp = function() {
		$('#appModal').modal('hide');
	}
	
	$scope.init();
	
}]);