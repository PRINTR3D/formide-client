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
	updates: [
		/*
{
			'name': 'driver',
			'version': '1.0.1',
			'url': 'http://nodejs.org/dist/v0.10.35/node-v0.10.35.tar.gz'
		},
		{
			'name': 'interface',
			'manufacturer': 'printspot-formide-dashboard',
			'version': '1.0.1',
			'url': 'http://printr.nl/wp-content/uploads/2014/11/Printr_presskit.zip'
		}
*/
	],

	init: function()
	{
		// check versions
		for(var i in this.updates)
		{
			this.checkVersion(this.updates[i]);
		}
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
	},

	checkVersion: function(update)
	{
		if(update.name == 'driver')
		{
			var currentInstall = require('../../../../formidium/package.json');
			if(semver.lt(currentInstall.version, update.version))
			{
				Printspot.debug('Driver update');
				this.download(update);
			}
		}
		else if(update.name == 'slicer')
		{
			var currentInstall = require('../../../../katana-slicer/package.json');
			if(semver.lt(currentInstall.version, update.version))
			{
				Printspot.debug('Slicer update');
				this.download(update);
			}
		}
		else if(update.name == 'core')
		{
			var currentInstall = require('../../package.json');
			if(semver.lt(currentInstall.version, update.version))
			{
				Printspot.debug('Core update');
				this.download(update);
			}
		}
		else if(update.name == 'interface')
		{
			var currentInstall = require('../../../interfaces/' + update.manufacturer + '/package.json');
			if(semver.lt(currentInstall.version, update.version))
			{
				Printspot.debug('Interface update');
				this.download(update);
			}
		}
	}
}