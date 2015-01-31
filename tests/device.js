Printspot = require('../Printspot.js')();
Printspot.register('device').init();

exports['init'] = function( test )
{
	test.ok(typeof Printspot.manager('device').init === 'function', 'Init function not found');
	test.done();
};