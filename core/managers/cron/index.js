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

/*
Printspot.manager('cron').schedulePrintjob(new Date(2015, 0, 8, 21, 38, 0), {
	"type": "dashboard_push_printer_start",
	"data": {
		"printjobID": 1,
		"hash": "/Volumes/Macintosh HDD/Chris/Sites/printr/github/printspot/uploads/gcode/GCODE_FILE_LOCATION"
	}
});
*/

var schedule = require('node-schedule');

module.exports =
{
	jobs: [],

	on:
	{
		'schedulePrintjob': 'schedulePrintjob'
	},

	getSchedule: function()
	{
		return this.jobs;
	},

	schedulePrintjob: function(date, data)
	{
		var cron = schedule.scheduleJob(date, function()
		{
			Printspot.debug('starting scheduled printjob');

			Printspot.events.emit('scheduledPrintjob', data);
		});

		this.jobs.push(cron);
	},

	cancelPrintjob: function(id)
	{
		this.jobs[id].cancel();
	}
};