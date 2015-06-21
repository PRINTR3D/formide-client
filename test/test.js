// start FORMIDEOS
require('../bootstrap/core');

describe('Creating a new User',function(){
	
	var User = require('../core/modules/db/models').User;
	var user;

	before(function(done){
		User.create({
			email: 'test@gmail.com',
			password: 'mypassword'
		}, function(err,u){
			user = u;
			done();        
  		});
	});

	it('should have an email',function(){
		user.should.have.property('email', 'test@gmail.com');
	});
	
	it('should have a password',function(){
		user.should.have.property('password');
	});
});