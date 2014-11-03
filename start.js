var exec 		= require('child_process').exec;
var argv 		= require('minimist')(process.argv.slice(2));

if(!argv.interface) {
	console.log('No interface given');
	process.exit(0);
}

if(argv.sim) {
	console.log('running in simulated qclient mode');
	var simulator = exec('node index.js', {cwd: 'printspot-qclient-simulator'});
}

var core = exec('node index.js --dev', {cwd: 'printspot-core'});
var manufacturer = exec('node index.js', {cwd: 'printspot-interface/' + argv.interface});

if(argv.dev) {
	console.log('running in dev mode');
	simulator.stdout.on('data', function(data) {
    	console.log('simulator: ' + data);
	});
	core.stdout.on('data', function(data) {
    	console.log('core: ' + data);
	});
	manufacturer.stdout.on('data', function(data) {
    	console.log('interface: ' + data);
	});
}