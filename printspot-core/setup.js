global.config 		= require('./config/core.json');

var polo = require('polo');
var apps = polo();

apps.put({
    name: 'printspot-core',
    host: global.config.local.host,
    port: global.config.local.port
});