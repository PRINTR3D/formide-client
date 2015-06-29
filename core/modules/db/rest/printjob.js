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
	routes.get('/printjobs', function(req, res) {
		db.Printjob.find().populate('materials modelfiles gcodefile printer sliceprofile').exec(function(err, printjobs) {
			if (err) return res.send(err);
			return res.send(printjobs);
		});
	});

	routes.get('/printjobs/:id', function(req, res) {
		db.Printjob.findOne({ _id: req.params.id }).populate('materials modelfiles gcodefile printer sliceprofile').exec(function(err, printjob) {
			if (err) return res.send(err);
			return res.send(printjob);
		});
	});
	
	// use to create printjob from gcodefile
	routes.post('/printjobs', function(req, res) {
		db.Printjob.create({
				sliceMethod: "custom",
				sliceFinished: true,
				gcode: req.body.gcodeHash,
				gcodefile: req.body.gcodeID
			}, function(err, printjob) {
			if (err) return res.status(400).send(err);
			if (printjob) {
				return res.send({
					printjob: printjob,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/printjobs/:id', function(req, res) {
		db.Printjob.remove({ _id: req.params.id }, function(err, printjob) {
			if (err) return res.status(400).send(err);
			var filePath = FormideOS.config.get('paths.modelfile') + '/' + printjob.gcode;
			fs.unlink(filePath, function() {
				return res.send({
					success: true
				});
			});
		});
	});
};