global.config 	= require('./printspot-config/config.json');

var exec 		= require('child_process').exec;
var argv 		= require('minimist')(process.argv.slice(2));
var net			= require('net');

if(!argv.interface) {
	console.log('No interface given');
	process.exit(0);
}

var nsclient = net.connect({port: global.config.client.port}, function() {
	
	console.log('printer driver connected');
	var core = exec('node index.js --dev', {cwd: 'printspot-core'});
	var manufacturer = exec('node index.js', {cwd: 'printspot-interface-' + argv.interface});
	
	if(argv.dev) {
		
		console.log('running in dev mode');
		
		core.stdout.on('data', function(data) {
	    	console.log('core: ' + data);
		});
		
		manufacturer.stdout.on('data', function(data) {
	    	console.log('interface: ' + data);
		});
	}
});