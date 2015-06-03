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

		setTimeout(function()
		{
			client.write(JSON.stringify(json));
		}, 5000);
	});
});

server.listen(1339, function() {});