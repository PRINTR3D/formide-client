process.title = 'printspot-qclient-simulator';

var net = require('net');

var server = net.createServer(function(client) {

	client.on('data', function(data) {
		console.log(data.toString());
	});

	console.log('qclient simulator running');

	setTimeout(function() {
		setInterval(function() {

			var json = {
			   "type": "client_push_printer_status",
			   "data": {
				   "status": "printing",
				   "printjobID": 1,
			       "extruders": [
			           {
				           "name": "beehead_extruder1",
			               "temp": Math.floor(Math.random() * 300),
			               "targettemp": 195,
			               "filament": {
				               "material": 0,
							   "currentLength": 1000,
							   "totalLength": 3000,
							   "red": 0,
							   "green": 0,
							   "blue": 255
			               }
			           },
			           {
				           "name": "beehead_extruder2",
			               "temp": Math.floor(Math.random() * 50),
			               "targettemp": 210,
			               "filament": {
				               "material": 0,
							   "currentLength": 1000,
							   "totalLength": 3000,
							   "red": 34,
							   "green": 157,
							   "blue": 145
			               }
			           }
			       ],
			       "bed": {
				       "temp": 45,
				       "targettemp": 50
			       	}
			   	}
			}

			client.write(JSON.stringify(json));
		}, 2000);
	}, 2000);
});

server.listen(1338, function() { //'listening' listener
  	address = server.address();
  	console.log("opened server on %j", address);
});