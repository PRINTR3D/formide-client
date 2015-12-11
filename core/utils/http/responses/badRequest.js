/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function badRequest(message, error) {

	// Get access to `req`, `res`, & `sails`
	var req = this.req;
	var res = this.res;
	var statusCode = 400;
	var statusName = "Bad Request";
	
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