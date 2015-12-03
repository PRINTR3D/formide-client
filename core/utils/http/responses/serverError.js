/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function badRequest(error) {

	var req = this.req;
	var res = this.res;
	var statusCode = 500;
	var statusName = "Server Error";

	// Set status code
	res.status(statusCode);

	if (process.env.NODE_ENV === 'production') {
		return res.json({
			statusCode: statusCode,
			statusName: statusName,
			message: error.message
		});
	}
	else {
		return res.json({
			statusCode: statusCode,
			statusName: statusName,
			message: error.message,
			error: error,
			stack: error.stack
		});
	}
};
