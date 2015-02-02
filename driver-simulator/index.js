process.title = 'printspot-qclient-simulator';

var net = require('net');
var printjobID = 0;
var printerStatus = 'online';
var targetTemp = 0;
var targetBedTemp = 0;
var progress = 0;

var server = net.createServer(function(client)
{
	client.on('data', function(data)
	{
		console.log(data.toString());
		data = JSON.parse(data);

		if(data.type == 'temp_extruder')
		{
			targetTemp = data.data.temp;
		}

		if(data.type == 'temp_bed')
		{
			targetBedTemp = data.data.temp;
		}

		if(data.type == 'start')
		{
			printjobID = data.data.printjobID;
			printerStatus = 'printing';
		}

		if(data.type == 'stop')
		{
			progress = 0;
			printerStatus = 'online';
		}
	});

	console.log('qclient simulator running');

	setTimeout(function()
	{
		setInterval(function()
		{
			var json = {
			   "type": "status",
			   "data": {
				   "status": printerStatus,
				   "progress": progress,
				   "printjobID": printjobID,
			       "extruders": [
			           {
				           "name": "extruder1",
			               "temp": targetTemp,
			               "targettemp": targetTemp,
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
				           "name": "extruder2",
			               "temp": targetTemp,
			               "targettemp": targetTemp,
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
				       "temp": targetBedTemp,
				       "targettemp": targetBedTemp
			       	}
			   	}
			}

			if(!client.destroyed) {
				client.write(JSON.stringify(json));
			}

			if(printerStatus == 'printing')
			{
				progress += 5;
			}

			if(progress == 100)
			{
				printerStatus = 'online';
				progress = 0;

				var json2 = {
				   "type": "finished",
				   "data": {
					   "printjobID": printjobID
				   }
				}

				if(!client.destroyed) {
					client.write(JSON.stringify(json2));
				}
			}

		}, 2000);
	}, 2000);
});

server.listen(1338, function()
{
  	address = server.address();
  	console.log("opened server on %j", address);
});