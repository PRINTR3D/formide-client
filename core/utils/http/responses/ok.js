/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function ok(data) {

	var req = this.req;
	var res = this.res;
	var statusCode = 200;
	var statusName = "OK";
	
	// Set status code
	res.status(statusCode);
	
	return res.json(data);
};