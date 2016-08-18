/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function forbidden(message, error) {

	var req = this.req;
	var res = this.res;
	var statusCode = 403;
	var statusName = "Forbidden";
	
	// Set status code
	res.status(statusCode);
	
	if (process.env.NODE_ENV === 'production') {
		error = undefined;
	}
	
	return res.json({
		statusCode: statusCode,
		statusName: statusName,
		message: message,
		error: error
	});
};