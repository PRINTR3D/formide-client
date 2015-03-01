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

module.exports = function(server, module)
{
	/**
	 * Take a snapshot of the printer
	 */
	server.route({
		method: 'GET',
		path: '/api/camera/snapshot',
		handler: function(req, res)
		{
			module.takeSnapshot();
			res('OK');
		}
	});

	/**
	 * Get latest snapshot of the printer
	 */
	server.route({
		method: 'GET',
		path: '/api/camera/src',
		handler: function(req, res)
		{
			return res.file('../uploads/images/image.jpg');
		}
	});

	/**
	 * Get 'real-time' feed
	 */
	server.route({
		method: 'GET',
		path: '/api/camera/preview',
		handler: function(req, res)
		{
			var page = "<html><head>" +
			"<script>setInterval( function() { var image = document.getElementById('image'); image.src = '/api/camera/src'; }, 2000);</script>" +
			"<title>FormideOS Camera Feed</title>\n" +
			"</head><body>\n" +
			"<img id='image'/>" +
			"</body>\n" +
			"</html>\n";
			return res(page);
		}
	});
}