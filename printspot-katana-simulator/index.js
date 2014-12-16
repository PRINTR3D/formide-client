process.title = 'printspot-katana-simulator';

var net = require('net');

var server = net.createServer(function(client)
{
	client.on('data', function(data)
	{
		console.log(data.toString());
		data = JSON.parse(data);

		var json = {
			"status": 200,
			"data": {
				"materials":
				[
					{
						"amount": 1157,
						"extruder": 0
					}
				],
				"time": 2598,
				"gcode": "GCODE_FILE_LOCATION",
				"responseID": data.data.responseID
			}
		}

		client.write(JSON.stringify(json));
	});

	console.log('katana simulator running');
});

server.listen(1339, function()
{
  	address = server.address();
  	console.log("opened server on %j", address);
});