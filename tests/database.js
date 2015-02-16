Printspot = require('../Printspot.js')();
Printspot.register('database').init(Printspot.config.get('database'));

exports['init'] = function( test )
{
	test.ok(typeof Printspot.manager('database').init === 'function', 'Init function not found');
	test.done();
};

exports['users'] = function( test )
{
	test.ok(Printspot.manager('database').db.User.name === 'User', 'Users not valid');
	test.done();
};

exports['printjobs'] = function( test )
{
	test.ok(Printspot.manager('database').db.Printjob.name === 'Printjob', 'Printjobs not valid');
	test.done();
};

exports['queue'] = function( test )
{
	test.ok(Printspot.manager('database').db.Queueitem.name === 'Queueitem', 'Queue not valid');
	test.done();
};

exports['modelfiles'] = function( test )
{
	test.ok(Printspot.manager('database').db.Modelfile.name === 'Modelfile', 'Modelfiles not valid');
	test.done();
};

exports['printers'] = function( test )
{
	test.ok(Printspot.manager('database').db.Printer.name === 'Printer', 'Printers not valid');
	test.done();
};

exports['materials'] = function( test )
{
	test.ok(Printspot.manager('database').db.Material.name === 'Material', 'Materials not valid');
	test.done();
};

exports['sliceprofiles'] = function( test )
{
	test.ok(Printspot.manager('database').db.Sliceprofile.name === 'Sliceprofile', 'Sliceprofiles not valid');
	test.done();
};