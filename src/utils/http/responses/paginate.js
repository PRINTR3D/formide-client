/**
 * 200 (paginate) Response
 *
 * Usage:
 * return res.paginate(data);
 * return res.paginate(data, {});
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendPaginate (data, options) {

	var req = this.req;
	var res = this.res;

	options = options || {};
	options.count = options.count || 0;

	FormideClient.log.silly('res.paginate() :: Sending 200 (paginate) response');

	// Set status code
	res.status(200);

	var responseLinkHeaders = [];
	var prevOffset = (parseInt(req.pagination.offset, 10) - parseInt(req.pagination.limit, 10));
	var nextOffset = (parseInt(req.pagination.offset, 10) + parseInt(req.pagination.limit, 10));
	var lastPageOffset = 0;

	// get last page by taking modulus of limit and total count
	if (options.count !== 0) {
		lastPageOffset = (parseInt(req.pagination.limit, 10) % options.count) * req.pagination.limit;
	}

	// only add prev item when offset is 0 or larger
	if (prevOffset > -1) {
		responseLinkHeaders.push('<' + process.env.ROOTURL + req.route.path + '?offset=' + prevOffset + '&limit=' + req.pagination.limit + '>; rel=\x27prev\x27');
	}

	// only add next link when page contains maximum number of items
	if (nextOffset < options.count) {
		responseLinkHeaders.push('<' + process.env.ROOTURL + req.route.path + '?offset=' + nextOffset + '&limit=' + req.pagination.limit + '>; rel=\x27next\x27');
	}

	// set first and last link headers
	responseLinkHeaders.push('<' + process.env.ROOTURL + req.route.path + '?offset=0&limit=' + req.pagination.limit + '>; rel=\x27first\x27');
	responseLinkHeaders.push('<' + process.env.ROOTURL + req.route.path + '?offset=' + lastPageOffset + '&limit=' + req.pagination.limit + '>; rel=\x27last\x27');

	// If appropriate, serve data as JSON(P) with appropriate Link header
	res.set('Link', responseLinkHeaders.join(','));

	// Set content-range header
	res.set('Content-Range', req.pagination.offset + '-' + nextOffset + '/' + options.count);

	// return response
	return res.jsonx(data);
};
