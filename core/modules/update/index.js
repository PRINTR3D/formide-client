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

var fs 			= require('fs');
var request 	= require('request');
var progress	= require('request-progress');
var shastream	= require('sha1-stream');
var sniff		= shastream.createStream();
var semver		= require('semver');

module.exports =
{
	name: "core.update",
	
	currentVersion: "1.0.0",

	update: {},

	progress: {
		download: 0,
		validate: 0,
		install: 0
	},

	init: function()
	{
		this.check();
	},

	check: function()
	{
		this.currentVersion = fs.readFileSync('version.txt').toString();
		request(
		{
			method: 'GET',
			url: 'https://formide.com/updates/list.json',
			strictSSL: false,
		},
		function(error, response, body)
		{
			this.update.updates = JSON.parse(body);
			this.update.latestUpdate = this.update.updates.pop();
			this.update.needsUpdating = semver.lt(this.currentVersion, this.update.latestUpdate.release.version);
		}.bind(this));
	},

	download: function()
	{
		var _that = this;

		if(_that.update.needsUpdating) // only download when update required
		{
			progress( request(
			{
				method: 'GET',
				url: _that.update.latestUpdate.url,
				strictSSL: false,
				gzip: true
			}))
			.on( 'progress', function( state )
			{
				_that.progress.download = state.percent;
			})
			.on( 'error', function( err )
			{
				console.log('progress err', err);
			})
			.pipe(sniff)
			.pipe(fs.createWriteStream( 'formideos.v' + _that.update.latestUpdate.release.version + '.zip' ))
			.on( 'error', function( err )
			{
				console.log('request err', err);
			})
			.on( 'close', function( err )
			{
				_that.progress.download = 100;

				if(err)
				{
					console.log('close', err);
				}
			});
		}
	}
}

module.exports.init();
require('./api.js')(server, module.exports);