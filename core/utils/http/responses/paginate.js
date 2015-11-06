/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendOK (data, options) {

	// Get access to `req`, `res`, & `sails`
	var req = this.req;
	var res = this.res;
	var sails = req._sails;
	
	// set defaults for options
	options = options || {
	  prev: true,
	  next: true
	};
	
	// Set status code
	res.status(200);
	
	var responseLinkHeaders = [];
	
	if (options.next) {
		responseLinkHeaders.push('<' + process.env.ROOTURL + '/auth/sessions?offset=' + (parseInt(req.pagination.offset) + parseInt(req.pagination.limit)) + '&limit=' + req.pagination.limit + '>; rel="next"');
	}
	
	if (options.prev) {
		responseLinkHeaders.push('<' + process.env.ROOTURL + '/auth/sessions?offset=' + (parseInt(req.pagination.offset) - parseInt(req.pagination.limit)) + '&limit=' + req.pagination.limit + '>; rel="next"');
	}
	
	if (options.first) {
	//responseLinkHeaders.push('<' + process.env.ROOTURL + '/auth/sessions?offset=' + (req.pagination.offset - req.pagination.limit) + '&limit=' + req.pagination.limit + '>; rel="next"');
	}
	
	if (options.last) {
	//responseLinkHeaders.push('<' + process.env.ROOTURL + '/auth/sessions?offset=' + (req.pagination.offset - req.pagination.limit) + '&limit=' + req.pagination.limit + '>; rel="next"');
	}
	
	// If appropriate, serve data as JSON(P) with appropriate Link header
	res.set("Link", responseLinkHeaders.join(','));
	
	// return response
	return res.jsonx(data);
};