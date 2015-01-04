var spawn       	= require('child_process').spawn;
var argv        	= require('minimist')(process.argv.slice(2));
var net         	= require('net');
var manufacturer_d 	= 'printspot-formide-dashboard';

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

if(argv.driver)
{
	var client = spawn('node', ['index.js'], {cwd: 'printspot-qclient-simulator', stdio: 'pipe'});
}

if(argv.slicer)
{
	var katana = spawn('node', ['index.js'], {cwd: 'printspot-katana-simulator', stdio: 'pipe'});
}

var core = spawn('node', ['bootstrap.js'], {cwd: 'core', stdio: 'pipe'});

if(argv.driver)
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

if(argv.dev)
{
    console.log('running in dev mode');

    if(argv.driver)
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
}