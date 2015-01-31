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

// dependencies
var Download = require('download');
var progress = require('download-status');
var semver = require('semver');

module.exports =
{
	init: function()
	{

	},

	on:
	{

	},

	download: function(update)
	{
		Printspot.debug('downloading ' + update.name + ' from ' + update.url);

		new Download({ strip: 1, mode: '755' })
		.get(update.url)
		.dest('dest')
		.use(this.progress)
		.run(function(err, files, stream)
		{
			if(err)
			{
				Printspot.debug(err, true);
			}
		});
	},

	progress: function(res, url)
	{
		var total = parseInt(res.headers['content-length'], 10);
		var curr = 0;
		var prevRatio = 0;

		res.on('data', function(data)
		{
			var prevCurr = curr;
			curr += data.length;
			var ratio = ((curr / total) * 100).toFixed(0);

			if(prevRatio < ratio)
			{
				Printspot.events.emit('updateProgress', {
					type: 'download',
					progress: ratio,
					url: url
				});
			}

			prevRatio = ratio;
		});

		res.on('end', function()
		{
			// check download and replace current file
		});
	}
}