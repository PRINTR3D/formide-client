// server/socket.js

module.exports = function(localIO, onlineIO, nsclient, macAddress) {

	/*
	 * Setup online connection
	 */
	onlineIO.on('connect', function() {
		global.log('new online server connection');
		
		onlineIO.on('handshake', function(data) {
			onlineIO.emit('typeof', {
				type: 'client',
				mac: macAddress
			});
		});
		
		/*
		 * Dynamically load online dashboard functions from config.json
		 */
		for(var method in global.config.dashboard_commands) {
			(function(realMethod) {
				onlineIO.on(realMethod, function(data) {	
					// chekc if incoming message is meant for this printer			
					if(data.printerID == macAddress) {
						var json = {
							"type": realMethod,
							"args": data
						};
						nsclient.write(JSON.stringify(json));
						global.log('online: ' + realMethod + ': ' + json);
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
		global.log('new local dashboard connection');
		socket.emit('handshake', {id:socket.id});
		
		// Authentication not really neccesery locally
		socket.on('typeof', function(data) {
			global.log('typeof ' + data.type);
			if(data.type == 'dashboard') {
				socket.emit('auth', {message: 'OK', id: socket.id});
			}
		});
		
		// Socket disconnect
		socket.on('disconnect', function() {
			global.log('dashboard disconnected');
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
					global.log('local: ' + realMethod + ': ' + json);
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
	
	global.log('Module loaded: socket.js');
};