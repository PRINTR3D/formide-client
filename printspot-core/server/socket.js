// server/socket.js

module.exports = function(localIO, onlineIO, nsclient, macAddress, logger) {

	/*
	 * Setup online connection
	 */
	onlineIO.on('connect', function() {
		
		onlineIO.on('handshake', function(data) {
			global.log('info', 'new online server connection');
			onlineIO.emit('typeof', {
				type: 'client',
				mac: macAddress
			});
		});
		
		/*
		 * Stream data logging to Printr servers
		 */
		global.logger.on('logging', function (transport, level, msg, meta) {
	    	onlineIO.emit('client_push_log', {level: level, msg: msg, meta: meta, printerID: macAddress});
	  	});
		
		/*
		 * Dynamically load online dashboard functions from config.json
		 */
		for(var method in global.config.dashboard_commands) {
			(function(realMethod) {
				onlineIO.on(realMethod, function(data) {	
					// check if incoming message is really meant for this printer			
					if(data.printerID == macAddress) {
						var json = {
							"type": realMethod,
							"args": data
						};
						nsclient.write(JSON.stringify(json));
						global.log('debug', 'online server command ' + realMethod, data);
					}
				});
			})(method);
		}
		
		/*
		 * Receive client data and send to online dashboard
		 */
		nsclient.on('data', function(data) {
			var data = JSON.parse(data.toString());
			// add printer ID to arguments
			data.args.printerID = macAddress;
			onlineIO.emit(data.type, data.args);
		});
	});
	
	/*
	 * Setup local connection
	 */
	localIO.sockets.on('connection', function(socket) {
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
				
					nsclient.write(JSON.stringify(json));
					global.log('debug', 'local dashboard command ' + realMethod, data);
				});
			})(method);
		}
		
		/*
		 * Receive client data and send to local dashboard
		 */
		nsclient.on('data', function(data) {
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