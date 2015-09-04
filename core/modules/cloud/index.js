/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var net 		= require('net');
var request 	= require('request');
var socket 		= require('socket.io-client');
var publicIp 	= require('public-ip');
var internalIp 	= require('internal-ip');
var fs			= require('fs');
var uuid		= require('node-uuid');
var async		= require('async');

module.exports =
{	
	// socket connections
	cloud: null,
	local: null,

	/*
	 * Init for cloud module
	 */
	init: function(config) {
		
		// use self to prevent bind(this) waterfall
		var self = this;
		
		// init cloud with new socket io client to online cloud url
		this.cloud = socket(config.url);
		this.local = socket( 'ws://127.0.0.1:' + FormideOS.http.server.address().port);

		/*
		 * Connect to the cloud socket server
	 	 */
		this.cloud.on('connect', function() {
			// authenticate formideos based on mac address and api token, also sends permissions for faster blocking via cloud
			publicIp(function (err, ip) {
				var pkg = fs.readFileSync(FormideOS.appRoot + 'package.json', 'utf8');
				pkg = JSON.parse(pkg);
				self.cloud.emit('authenticate', {
					type: 'client',
					mac: FormideOS.macAddress,
					ip: ip,
					ip_internal: internalIp(),
					version: pkg.version,
					environment: FormideOS.config.environment,
					port: FormideOS.config.get('app.port')
				}, function(response) {
					if (response.success) {
						FormideOS.debug.log('Cloud connected');
						
						// forward all events to the cloud
						FormideOS.events.onAny(function(data) {
							self.cloud.emit(this.event, data);
						});
					}
					else {
						// something went wrong when connecting to the cloud
						FormideOS.debug.log('Cloud connection error: ' + response.message);
					}
				});
			});
		});
		
		/*
		 * See if client is online
		 */
		this.cloud.on('ping', function(data, callback) {
			return callback('pong');
		});
		
		/*
		 * This event is triggered when a user logs into the cloud and want to access one of his clients
		 */
		this.cloud.on('authenticateUser', function(data, callback) {
			this.authenticate(data, function(err, accessToken) {
				if (err) return callback(err);
				FormideOS.debug.log('Cloud user authorized with access_token ' + accessToken.token);
				return callback(null, accessToken.token);
			});
		}.bind(this));

		/*
		 * HTTP proxy request from cloud
		 */
		this.cloud.on('http', function(data, callback) {
			FormideOS.debug.log('Cloud http call: ' + data.url);
			// call http function
			this.http(data, function(err, response) {
				return callback(response);
			});
		}.bind(this));
		
		/*
		 * Send a gcode file to a client to print a cloud sliced printjob
		 */
		this.cloud.on('addToQueue', function(data, callback) {
			FormideOS.debug.log('Cloud addToQueue: ' + data.hash);
			self.addToQueue(data, function(err, response) {
				return callback(err, response);
			});
		});
		
		/*
		 * Sync printers from local database to cloud (when adding new client or manually syncing cloud/local printers)
		 */
		this.cloud.on('syncPrinters', function(cloudPrinters, callback) {
			FormideOS.debug.log('Cloud syncPrinters');
			self.syncPrinters(cloudPrinters, function(err, localPrinters) {
				return callback(err, localPrinters);
			});
		});

		/*
		 * Handle disconnect
	 	 */
		this.cloud.on('disconnect', function() {
			FormideOS.debug.log('Cloud disconnected');
		});
	},

	/*
	 * Handles cloud authentication based on cloudConnectionToken, returns session access_token that cloud uses to perform http calls from then on
	 */
	authenticate: function(data, callback) {
		FormideOS.module('db').db.AccessToken.generate(data, 'cloud', function(err, accessToken) {
			if (err) return callback(err);
			return callback(null, accessToken);
		});
	},

	/*
	 * Handles HTTP proxy function calls from cloud connection, calls own local http api after reconstructing HTTP request
	 */
	http: function(data, callback) {
		if (data.method === 'GET') {
			request({
				method: 'GET',
				uri: 'http://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.url,
				auth: {
					bearer: data.token // add cloud api key to authorise to local HTTP api
				},
				qs: data.data
			}, function( error, response, body ) {
				return callback(null, body);
			});
		}
		else {
			request({
				method: data.method,
				uri: 'http://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.url,
				auth: {
					bearer: data.token // add cloud api key to authorise to local HTTP api
				},
				form: data.data
			}, function( error, response, body ) {
				return callback(null, body);
			});
		}
	},
	
	/*
	 * Handles addToQueue from cloud
	 */
	addToQueue: function(data, callback) {
		var self = this;
		var hash = uuid.v4();
		
		FormideOS.module('db').db.Printer.findOne({ port: data.port }).exec(function(err, printer) {
			if (err) return callback(err);
			FormideOS.module('db').db.Queueitem.create({
				origin: 'cloud',
				status: 'queued',
				gcode: hash,
				printjob: data.printjob,
				printer: printer.toObject()
			}, function(err, queueitem) {
				if (err) return callback(err);
				callback(null, {
					success: true,
					queueitem: queueitem
				});
				
				request({
					method: 'GET',
					url: FormideOS.config.get('cloud.url') + '/files/gcodefiles/public',
					qs: {
						hash: data.hash
					},
					strictSSL: false
				})
				.on('response', function(response) {
					var newPath = FormideOS.config.get('app.storageDir') + FormideOS.config.get('paths.gcode') + '/' + hash;
					var fws = fs.createWriteStream(newPath);
					response.pipe(fws);
					response.on( 'end', function() {
						FormideOS.debug.log('finished downloading gcode. Recieved ' + fws.bytesWritten + ' bytes');
		        	});
				});
			});
		});
	},
	
	/*
	 * Handle syncPrinters from cloud
	 */
	syncPrinters: function(cloudPrinters, callback) {
		FormideOS.module('db').db.Printer.find().exec(function(err, printers) {
			if (err) return callback(err);
			async.each(cloudPrinters, function(cloudPrinter, cb) {
				// update or inset printer
				FormideOS.module('db').db.Printer.update({ cloudId: cloudPrinter._id }, {
					name: cloudPrinter.name,
					bed: cloudPrinter.bed,
					axis: cloudPrinter.axis,
					extruders: cloudPrinter.extruders,
					port: cloudPrinter.port,
					baudrate: cloudPrinter.baudrate,
					cloudId: cloudPrinter._id
				}, { upsert: true }, function(err, syncedPrinter) {
					if (err) {
						FormideOS.debug.log('Cloud sync error: ' + err );
						return cb(err);
					}
					else {
						FormideOS.debug.log('Synced printer from cloud: ' + syncedPrinter);
						return cb(null, {});
					}
				});
			}, function(err, results) {
				if (err) return callback(err);
				return callback(null, results);
			});
		});
	}
}