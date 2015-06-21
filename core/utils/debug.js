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

var callerId 	= require('caller-id');
var colors 		= require('colors');
var clc 		= require('cli-color');

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = {
	
	modules: {},

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
}