var server = require('net').createServer();

server.on('connection', function(client) {
	
	client.on('data', function(data) {
		console.log(data.toString());
	});
	
	var json = {
		"type": "client_push_printer_status",
		"args": {
			status: 'heating',
			etemp: Math.random() * 300,
			tetemp: 200,
			btemp: Math.random() * 50,
			tbempt: 50
		}
	};
	
	// wait a second before sending first message
	setTimeout(function() {
		client.write(JSON.stringify(json));
	}, 1000);
});

server.listen(1338, function() { //'listening' listener
  	address = server.address();
  	console.log("opened server on %j", address);
});