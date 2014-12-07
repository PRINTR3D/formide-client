process.title = 'printspot-katana-simulator';

var net = require('net');

var server = net.createServer(function(client) {

	client.on('data', function(data) {
		console.log(data.toString());
	});

	console.log('katana simulator running');
});

server.listen(1339, function() { //'listening' listener
  	address = server.address();
  	console.log("opened server on %j", address);
});