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

module.exports = function(routes, module)
{
	routes.get('/materials', function( req, res ) {
		module.db.Material.find().exec(function(err, materials) {
			if (err) return res.send(err);
			return res.send(materials);
		});
	});

	routes.get('/materials/:id', function( req, res ) {
		module.db.Material.findOne({ _id: req.params.id }).exec(function(err, material) {
			if (err) return res.send(err);
			return res.send(material);
		});
	});

	routes.post('/materials', function(req, res) {
		module.db.Material.create(req.body, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
				return res.send({
					material: material,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.put('/materials/:id', function(req, res) {
		module.db.Material.update({ _id: req.params.id }, req.body, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/materials/:id', function(req, res) {
		module.db.Material.remove({ _id: req.params.id }, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});
};