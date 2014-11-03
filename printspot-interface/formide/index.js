// index.js
process.title = 'printspot-interface';

// set up ========================
global.userConfig	= require('./../../printspot-config/userConfig.json');
global.config 		= require('./../../printspot-config/config.json');

var express 		= require('express');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var app 			= express();
var server 			= app.listen(global.config.local.interfaceport);

// configuration =================
app.use('/public', express.static(__dirname + '/public'));
app.use('/Web.unity3d', express.static(__dirname + '/public/assets/unity/Web.unity3d'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// routes ========================
app.get('*', function(req, res) {
	res.render('index');
});

// start interface app =====================
console.log('Interface for Formide running on ' + global.config.local.interfaceport);