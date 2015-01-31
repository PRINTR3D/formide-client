Printspot = require('../Printspot.js')();
Printspot.register('process').init();

exports['init'] = function( test )
{
	test.ok(typeof Printspot.manager('process').init === 'function', 'Init function not found');
	test.done();
};