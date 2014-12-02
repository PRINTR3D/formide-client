global.config   = require('./printspot-config/config.json');

var spawn       = require('child_process').spawn;
var argv        = require('minimist')(process.argv.slice(2));
var net         = require('net');

if(!argv.interface) {
    console.error('No interface given');
    process.exit(1);
}

if(argv.simulator) {
	console.log('Simulated client mode');
}

function readlines(stream,cb) {
    var buf = '';
    stream.on('data',function(data) {
        buf += data;
        var lines = buf.split('\n');
        buf = lines.pop();
        lines.forEach(function(line) { cb(line); });
    });
    return stream;
}

//var nsclient = net.connect({port: global.config.client.port}, function() {

    console.log('printer driver connected');

	if(argv.simulator) {
		var client = spawn('node', ['index.js'], {cwd: 'printspot-qclient-simulator', stdio: 'pipe'});
	}

    var core = spawn('node', ['index.js','--dev'], {cwd: 'printspot-core', stdio: 'pipe'});
    var manufacturer = spawn('node', ['index.js'], {cwd: argv.interface, stdio: 'pipe'});

	if(argv.simulator) {
	    client.on('exit',function(code) { console.error('client exited', code); });
		client.on('error',function(err) { console.log('client error',err); });
    }

    core.on('exit',function(code) { console.error('core exited', code); });
    core.on('error',function(err) { console.log('core error',err); });

    manufacturer.on('exit',function(code) { console.error('manufacturer exited', code); });
    manufacturer.on('error',function(err) { console.log('manufacturer error',err); });

    if(argv.dev) {
        console.log('running in dev mode');

		if(argv.simulator) {
			readlines(client.stdout, console.log.bind(null,'client:'));
			readlines(client.stderr, console.error.bind(null,'client:'));
		}

        readlines(core.stdout, console.log.bind(null,'core:'));
        readlines(core.stderr, console.error.bind(null,'core:'));

        readlines(manufacturer.stdout, console.log.bind(null,'manufacturer:'));
        readlines(manufacturer.stderr, console.error.bind(null,'manufacturer:'));
    }
//});