global.config   = require('./printspot-config/config.json');

var spawn       = require('child_process').spawn;
var argv        = require('minimist')(process.argv.slice(2));
var net         = require('net');

if(!argv.interface) {
    console.log('No interface given');
    process.exit(0);
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

var nsclient = net.connect({port: global.config.client.port}, function() {

    console.log('printer driver connected');

    var core = spawn('node', ['index.js','--dev'], {cwd: 'printspot-core', stdio: 'pipe'});
    var manufacturer = spawn('node', ['index.js'], {cwd: 'printspot-interface-'+argv.interface, stdio: 'pipe'});

    core.on('exit',function(code) { console.error('core exited', code); });
    core.on('error',function(err) { console.log('core error',err); });

    manufacturer.on('exit',function(code) { console.error('manufacturer exited', code); });
    manufacturer.on('error',function(err) { console.log('manufacturer error',err); });
    if(argv.dev) {
        console.log('running in dev mode');

        readlines(core.stdout, console.log.bind(null,'core:'));
        readlines(core.stderr, console.error.bind(null,'core:'));

        readlines(manufacturer.stdout, console.log.bind(null,'manufacturer:'));
        readlines(manufacturer.stderr, console.error.bind(null,'manufacturer:'));
    }
});