app.factory('Printjobs', function($resource) {
	return $resource(api_url + '/api/printjobs/:id');
});

app.factory('Materials', function($resource) {
	return $resource(api_url + '/api/materials/:id');
});

app.factory('Sliceprofiles', function($resource) {
	return $resource(api_url + '/api/sliceprofiles/:id', {}, {
		create: { method:'POST' },
		update: { method:'PUT', params: {id: '@id'} }
	});
});

app.factory('Modelfiles', function($resource) {
	return $resource(api_url + '/api/modelfiles/:id');
});

app.factory('Users', function($resource) {
	return $resource(api_url + '/api/users/:id');
});

app.factory('Printers', function($resource) {
	return $resource(api_url + '/api/printers/:id');
});

app.factory('Settings', function($resource) {
	return $resource(api_url + '/api/settings/:id');
});