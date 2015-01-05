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

module.exports =
{
	installs: {
		'ClientDriver': 'https://s3.amazonaws.com/node-webkit/v0.7.5/node-webkit-v0.7.5-win-ia32.zip',
		'Test2': 'http://nodejs.org/dist/v0.10.35/node-v0.10.35.tar.gz'
	},

	init: function()
	{
		// check versions
		this.checkVersion('ClientDriver');
	},

	on: {
		'update': 'update'
	},

	update: function()
	{
		for(var i in this.installs)
		{
			this.download(this.installs[i]);
		}
	},

	download: function(installURL)
	{
		Printspot.debug('downloading ' + installURL);
		new Download({ strip: 1, mode: '755' })
		.get(installURL)
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
	},

	checkVersion: function(type)
	{

	}
}