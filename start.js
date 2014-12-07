global.config   = require('./printspot-config/config.json');

var spawn       = require('child_process').spawn;
var argv        = require('minimist')(process.argv.slice(2));
var net         = require('net');

if(!argv.interface) {
    console.error('No interface given');
    process.exit(1);
<<<<<<< HEAD
}

if(argv.simulator) {
	console.log('Simulation mode');
=======
>>>>>>> master
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

if(argv.simulator) {
	var client = spawn('node', ['index.js'], {cwd: 'printspot-qclient-simulator', stdio: 'pipe'});
}

if(argv.slicer) {
	var katana = spawn('node', ['index.js'], {cwd: 'printspot-katana-simulator', stdio: 'pipe'});
}

var core = spawn('node', ['index.js','--dev'], {cwd: 'printspot-core', stdio: 'pipe'});
var manufacturer = spawn('node', ['index.js'], {cwd: argv.interface, stdio: 'pipe'});

if(argv.simulator) {
    client.on('exit',function(code) { console.error('client exited', code); });
	client.on('error',function(err) { console.log('client error',err); });
}

if(argv.slicer) {
	katana.on('exit',function(code) { console.error('katana exited', code); });
	katana.on('error',function(err) { console.log('katana error',err); });
}

core.on('exit',function(code) { console.error('core exited', code); });
core.on('error',function(err) { console.log('core error',err); });

manufacturer.on('exit',function(code) { console.error('manufacturer exited', code); });
manufacturer.on('error',function(err) { console.log('manufacturer error',err); });

<<<<<<< HEAD
if(argv.dev) {
    console.log('running in dev mode');
=======
    var core = spawn('node', ['index.js','--dev'], {cwd: 'printspot-core', stdio: 'pipe'});
    var manufacturer = spawn('node', ['index.js'], {cwd: 'printspot-interface-'+argv.interface, stdio: 'pipe'});
>>>>>>> master

	if(argv.simulator) {
		readlines(client.stdout, console.log.bind(null,'client:'));
		readlines(client.stderr, console.error.bind(null,'client:'));
	}

<<<<<<< HEAD
	if(argv.slicer) {
		readlines(katana.stdout, console.log.bind(null,'katana:'));
		readlines(katana.stderr, console.error.bind(null,'katana:'));
	}
=======
    manufacturer.on('exit',function(code) { console.error('manufacturer exited', code); });
    manufacturer.on('error',function(err) { console.log('manufacturer error',err); });
    if(argv.dev) {
        console.log('running in dev mode');
>>>>>>> master

    readlines(core.stdout, console.log.bind(null,'core:'));
    readlines(core.stderr, console.error.bind(null,'core:'));

<<<<<<< HEAD
    readlines(manufacturer.stdout, console.log.bind(null,'manufacturer:'));
    readlines(manufacturer.stderr, console.error.bind(null,'manufacturer:'));
}
=======
        readlines(manufacturer.stdout, console.log.bind(null,'manufacturer:'));
        readlines(manufacturer.stderr, console.error.bind(null,'manufacturer:'));
    }
});
>>>>>>> master
