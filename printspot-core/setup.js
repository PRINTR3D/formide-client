global.config 		= require('./config/core.json');

var polo = require('polo');
var apps = polo();
var wireless = require('wireless-osx');

apps.put({
    name: 'printspot-core',
    host: global.config.local.host,
    port: global.config.local.port
});

var server = require('http').createServer(function(req, res) {
	res.end('socket.io');
});
server.listen(global.config.local.port);
var io = require('socket.io')(server);

io.on('connection', function(socket)
{
	socket.emit('handshake', { id: socket.id });

	socket.on('list_networks', function()
	{
		Airport = wireless.Airport;
		airport = new Airport('en0');

		airport.scan(function(err, results)
		{
			socket.emit('list_networks', results);
  		});
	});
});