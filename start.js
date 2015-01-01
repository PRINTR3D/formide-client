var spawn       = require('child_process').spawn;
var argv        = require('minimist')(process.argv.slice(2));
var net         = require('net');

function readlines(stream,cb)
{
    var buf = '';
    stream.on('data',function(data)
    {
        buf += data;
        var lines = buf.split('\n');
        buf = lines.pop();
        lines.forEach(function(line) { cb(line); });
    });
    return stream;
}

if(!argv.interface)
{
    console.error('No interface given');
    process.exit(1);
}
else
{
	/*
var interfaceConfig = require('./' + argv.interface + '/config.json');
	var coreConfig = require('./printspot-core/config/app.json');

	if(!interfaceConfig.dependencies['printspot-core'])
	{
		console.error('Interface config has no printspot-core dependency versions listed');
		process.exit(1);
	}
	else if(!coreConfig.version)
	{
		console.error('Core config has no verion number listed');
		process.exit(1);
	}
	else if(coreConfig.version != interfaceConfig.dependencies['printspot-core'])
	{
		console.error('Core version number is not compatible with interface printspot-core dependency version number');
		process.exit(1);
	}
*/
}

if(argv.simulator)
{
	var client = spawn('node', ['index.js'], {cwd: 'printspot-qclient-simulator', stdio: 'pipe'});
}

if(argv.slicer)
{
	var katana = spawn('node', ['index.js'], {cwd: 'printspot-katana-simulator', stdio: 'pipe'});
}

var core = spawn('node', ['bootstrap.js'], {cwd: 'core', stdio: 'pipe'});
var manufacturer = spawn('node', ['index.js'], {cwd: 'interfaces/' + argv.interface, stdio: 'pipe'});

if(argv.simulator)
{
    client.on('exit',function(code) { console.error('client exited', code); });
	client.on('error',function(err) { console.log('client error',err); });
}

if(argv.slicer)
{
	katana.on('exit',function(code) { console.error('katana exited', code); });
	katana.on('error',function(err) { console.log('katana error',err); });
}

core.on('exit',function(code) { console.error('core exited', code); });
core.on('error',function(err) { console.log('core error',err); });

manufacturer.on('exit',function(code) { console.error('manufacturer exited', code); });
manufacturer.on('error',function(err) { console.log('manufacturer error',err); });

if(argv.dev)
{
    console.log('running in dev mode');

    if(argv.simulator)
    {
		readlines(client.stdout, console.log.bind(null,'client:'));
		readlines(client.stderr, console.error.bind(null,'client:'));
	}

	if(argv.slicer)
	{
		readlines(katana.stdout, console.log.bind(null,'katana:'));
		readlines(katana.stderr, console.error.bind(null,'katana:'));
	}

    readlines(core.stdout, console.log.bind(null,'core:'));
    readlines(core.stderr, console.error.bind(null,'core:'));

    readlines(manufacturer.stdout, console.log.bind(null,'manufacturer:'));
    readlines(manufacturer.stderr, console.error.bind(null,'manufacturer:'));
}