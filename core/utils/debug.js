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

var callerId = require('caller-id');
var colors = require('colors');

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = {

	log: function(debug, severe)
	{
		if(FormideOS.config.get('app.debug') == true)
		{
			severe = severe || false;

			var caller = callerId.getData();
			var callerString = caller.evalOrigin.split(FormideOS.appRoot)[1];

			var date = new Date();

			var timestampString = addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds()) + ":" + addZero(date.getMilliseconds()) + '\t';
			var outputString = '[' + callerString + ']\t';

			FormideOS.manager('core.events').emit('log.debug', {message: debug, data: {manager: callerString[callerString.length - 2]}});

			if(outputString.length < 12) {
				outputString += '\u0020\u0020';
			}
			outputString += '\t';
			outputString += JSON.stringify(debug);

			if(severe) {
				console.log(timestampString.grey + ' ' + outputString.red);
			}
			else {
				console.log(timestampString.grey + ' ' + outputString.blue);
			}
			

/*
			if(caller.evalOrigin.indexOf('/managers') > -1)
			{
				var outputString = '[' + callerString[callerString.length - 2] + ']';
				if(outputString.length < 12)
				{
					outputString += '\u0020\u0020';
				}
				outputString += '\t';
				outputString += JSON.stringify(debug);

				if(severe)
				{
					console.log(timestampString.grey + ' ' + outputString.red);
				}
				else
				{
					console.log(timestampString.grey + ' ' + outputString.yellow);
				}
			}
			else
			{
				var outputString = '[FormideOS]\t';
				outputString += JSON.stringify(debug);

				if(severe)
				{
					console.log(timestampString.grey + ' ' + outputString.red);
				}
				else
				{
					console.log(timestampString.grey + ' ' + outputString.cyan);
				}
			}
*/
		}
	}
}