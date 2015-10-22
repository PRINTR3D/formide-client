/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Neat console debugging with colors, formatting and timestamps. We're not entirely happy with it,
 *	so feel free to make it better!
 */

var callerId 	= require('caller-id');
var colors 		= require('colors');
var clc 		= require('cli-color');
var log 		= require('captains-log')();

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = {
	
	modules: {},
	
	log: log

/*
	log: function(debug, severe) {
		if(FormideOS.config.get('app.debug') == true) {
			severe = severe || false;

			var maxLength = 40;
			var caller = callerId.getData();
			var callerString = caller.evalOrigin.split(FormideOS.appRoot)[1];
			var date = new Date();
			var timestampString = addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds()) + ":" + addZero(date.getMilliseconds()) + '\t';
			var debugInfo = {
				message: debug,
				modulePath: callerString,
				timestampString: timestampString,
				timestampDate: date
			};

			// emit debug event to system
			FormideOS.events.emit('log.debug', debugInfo);
			
			var outputString = '[' + callerString.substring(callerString.length - maxLength, callerString.length) + ']';
			for(var i = outputString.length; i < maxLength; i++) {
				outputString += '.';
			}
			
			outputString += ".." + JSON.stringify(debug);

			function randomFrom(items) {
				return items[Math.floor(Math.random()*items.length)];
			}
	
			if (this.modules[callerString]) {
				var color = clc.xterm(this.modules[callerString]);
				if( severe) {
					color.bgXterm(160);
				}
				console.log(color(timestampString.grey + ' ' + outputString));
			}
			else {
				var randomColor;
				if (callerString.indexOf('core') != -1) {
					randomColor = randomFrom([26, 27, 32, 33, 74, 75, 110, 111, 153, 117]);
				}
				else {
					randomColor = randomFrom([76, 77, 78, 112, 113, 114, 154, 155]);
				}
				var color = clc.xterm(randomColor);
				if( severe) {
					color.bgXterm(160);
				}
				this.modules[callerString] = randomColor;
				console.log(color(timestampString.grey + ' ' + outputString));
			}
		}
	}
*/
}