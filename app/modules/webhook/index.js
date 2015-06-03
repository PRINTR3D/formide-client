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

var request = require('request');

module.exports =
{
	init: function()
	{
		FormideOS.manager('core.events').on('log.error', this.call.bind(this));
	},

	call: function(data)
	{
		var payload = {
			text: data.data,
			username: data.message
		};

		request.post({
			method: 'POST',
			uri: FormideOS.settings.webhook.url,
			form: JSON.stringify(payload)
		}, function(error, response, body) {
			if (error) {
				return console.error('webhook error', error);
    		}
		});
	}
}