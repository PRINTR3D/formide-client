/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

module.exports = function(routes, db)
{
	routes.get('/printjobs', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function(req, res) {
		db.Printjob.find().exec(function(err, printjobs) {
			res.send(printjobs);
		});
	});

	routes.get('/printjobs/:id', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function( req, res ) {
		req.checkParams('id', 'id invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}
		
		db.Printjob.findOne({ _id: req.params.id }).exec(function(err, printjob) {
			res.send(printjob);
		});
	});

	routes.delete('/printjobs/:id', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function( req, res )
	{
		req.checkParams('id', 'id invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Printjob
		.find({ where: {id: req.params.id } })
		.on('success', function( printjob )
		{
			if(printjob)
			{
				printjob
				.destroy()
				.success(function()
				{
					return res.send({
						status: 200,
						message: 'OK'
					});
				});
			}
		});
	});
};