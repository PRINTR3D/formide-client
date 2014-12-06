// server/socket.js
var fs = require('fs');

module.exports = function(macAddress) {

	var authorized = false;

	/*
	 * Setup online connection
	 */
	global.comm.online.on('connect', function() {

		global.comm.online.on('handshake', function(data) {
			global.log('info', 'new online server connection', data);
			global.comm.online.emit('typeof', {
				type: 'client',
				mac: macAddress
			});
		});

		global.comm.online.on('auth', function(data) {
			if(data.message == 'OK') {
				authorized = true;
			}
		});

		/*
		 * Stream data logging to Printr servers
		 */
		global.logger.on('logging', function (transport, level, msg, meta) {
	    	global.comm.online.emit('client_push_log', {level: level, msg: msg, meta: meta, printerID: macAddress});
	  	});

		/*
		 * Dynamically load online dashboard functions from config.json
		 */
		for(var method in global.config.dashboard_commands) {
			(function(realMethod) {
				global.comm.online.on(realMethod, function(data) {
					// check if incoming message is really meant for this printer
					if(data.printerID == macAddress) {
						var json = {
							"type": realMethod,
							"args": data
						};
						global.comm.client.write(JSON.stringify(json));
						global.log('debug', 'online server command ' + realMethod, data);
					}
				});
			})(method);
		}

		global.comm.online.on('dashboard_push_printer_printjob', function(data) {
			if(data.printerID == macAddress) {
				var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
				var newPath = __dirname + '/uploads/gcode/' + hash;
				fs.writeFile(newPath, data.gcode, function(err) {
					if(err) {
						global.log('error', err, {'path': newPath});
					}
					else {
						global.db.Queueitem.create({
							slicedata: data.slicesettings,
							origin: 'online',
							gcode: hash,
							printjobID: data.id,
							status: "queued"
						});
					}
				});
			}
		});

		global.comm.online.on('dashboard_get_printer_queue', function(data) {
			if(data.printerID == macAddress) {
				global.db.Queueitem.findAll({ where: { status: 'queued' } }).success(function(queue) {
					global.comm.online.emit('client_push_printer_queue', {printerID: macAddress, data: queue});
				});
			}
		});

		/*
		 * Receive client data and send to online dashboard
		 */
		global.comm.client.on('data', function(data) {
			if(authorized) {
				var data = JSON.parse(data.toString());
				// add printer ID to arguments
				data.args.printerID = macAddress;
				global.comm.online.emit(data.type, data.args);
			}
		});
	});

	/*
	 * Setup local connection
	 */
	global.comm.local.sockets.on('connection', function(socket) {
		socket.emit('handshake', {id:socket.id});

		// Authentication not really neccesery locally
		socket.on('typeof', function(data) {
			global.log('info', 'new local dashboard connection', data);
			if(data.type == 'dashboard') {
				socket.emit('auth', {message: 'OK', id: socket.id});
			}
		});

		// Socket disconnect
		socket.on('disconnect', function() {
			global.log('info', 'local dashboard disconnected', {});
		});

		/*
		 * Dynamically load local dashboard functions from config.json
		 */
		for(var method in global.config.dashboard_commands) {
			(function(realMethod) {
				socket.on(realMethod, function(data) {

					var json = {
						"type": realMethod,
						"args": data
					};

					global.comm.client.write(JSON.stringify(json));
					global.log('debug', 'local dashboard command ' + realMethod, data);
				});
			})(method);
		}

		/*
		 * Receive client data and send to local dashboard
		 */
		global.comm.client.on('data', function(data) {
			global.log('debug', 'qclient status pushed', data.toString());
			var data;
			try {
				data = JSON.parse(data.toString());
			}
			catch(e) {
				global.log(e);
			}
			socket.emit(data.type, data.args);
		});

	});

	global.log('info', 'Module loaded: socket.js', {});
};