// server/routes.js

var request 		= require('request');
var passport 		= require('passport');
var LocalStrategy 	= require('passport-local').Strategy;
var crypto			= require('crypto');
var fs				= require('fs');
var multipart 		= require('connect-multiparty');
var multipartMiddleware = multipart();

passport.use(new LocalStrategy({
	usernameField: 'username', 
	passwordField: 'password'
},
function(username, password, done) {
	global.db.User.find({where: {username: username}})
		.success(function(user) {
			if(!user) {
				return done(null, false, {message: 'User does not exist'});
			}
			else if(password != user.password) {
				return done(null, false, {message: 'Wrong password'});
			}
			else {
				return done(null, user);
			}
		})	
		.error(function(err) {
			return done(err);
		});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	global.db.User.find(id)
		.success(function(user) {
			done(null, user);
		})
		.error(function(err) {
			done(new Error('User ' + id + ' does not exist'));
		});
});

module.exports = exports = function(app) {
	
	app.set('jwtTokenSecret', 'SECRETSTRING');
	app.use(passport.initialize());
	app.use(passport.session());
	
	// =====================================
	// SLICING =============================
	// =====================================
	app.post('/slicing', function(req, res) {
		if(req.body.modelfile != null && req.body.sliceprofile != null && req.body.material != null && req.body.printer) {
			global.db.Printjob.create({
				modelfileID: req.body.modelfile.id,
				printerID: req.body.printer.id,
				sliceprofileID: req.body.sliceprofile.id,
				materialID: req.body.material.id,
				sliceHash: "RANDOM",
				status: "queued",
				sliceLocation: req.body.slicemethod
			});
			return res.json('OK');
		}
		else {
			
		}
	});
	
	// =====================================
	// SETTINGS ============================
	// =====================================
	app.get('/api/settings', function(req, res) {
		
	});
	
	app.post('/api/settings', function(req, res) {
		
	});
	
	// =====================================
	// SESSION =============================
	// =====================================
	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if(err) {
				return res.send(401);
			}
			
			if(!user) {
				return res.send(401);
			}
			
			req.logIn(user, function(err) {
				return res.send(401);
			});
			
			var token = crypto.randomBytes(64).toString('hex');
			 
			return res.json({
				token : token,
				user: user.toJSON()
			});
		})(req, res, next);
	});
	
	app.get('/session', function(req, res) {
		return res.json(req.isAuthenticated());
	});
	
	app.post('/logout', function(req, res) {
		if(req.isAuthenticated()) {
			req.logout();
			return res.json('OK');
		}
	});
	
	// =====================================
	// FILES ===============================
	// =====================================
	app.get('/download', function(req, res) {
		fs.readFile(__dirname + '/uploads/modelfiles/' + req.query.hash, function(err, data) {
			if(err) {
				global.log(err);
			}
			else {
				var base64File = new Buffer(data, 'binary').toString('base64');
				res.send(base64File);
			}
		});
	});
	
	app.post('/upload', multipartMiddleware, function(req, res) {
		fs.readFile(req.files.file.path, function(err, data) {
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = __dirname + '/uploads/modelfiles/' + hash;
			fs.writeFile(newPath, data, function(err) {
				if(err) {
					global.log(err);
				}
				else {
					global.db.Modelfile.create({
						filename: req.files.file.name,
						filesize: req.files.file.size,
						hash: hash
					});
					res.json('OK');
					
				}
			});
		});
	});
	
	global.log('Module loaded: routes.js');
}