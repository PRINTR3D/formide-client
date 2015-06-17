process.title = 'printspot-katana-simulator';

var net = require('net');

var server = net.createServer(function(client) {
	client.on('data', function(data) {
		console(data.toString());
		
/*
		data = JSON.parse(data);
		var progress = 0;

		var resultJSON = {
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
		
		var progressJSON = {
			"status": 110,
			"data": {
				{
					"progress_type": "slicing_model",
					"responseID": data.data.responseID,
					"progress":54
				}
			}
		};
		
		function sendProgress() {
			setTimeout(function() {
				client.write(JSON.stringify(progressJSON));
				if(progress < 100) {
					progress += 5;
					sendProgress();
				}
				else {
					sendResult();
				}
			}, 2000);
		}
		
		function sendResult() {
			client.write(JSON.stringify(resultJSON));
		}
		
		sendProgress();
*/
	});
});

server.listen(1339, function() {});