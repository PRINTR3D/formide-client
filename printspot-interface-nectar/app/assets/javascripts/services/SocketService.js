app.factory('Realtime', function(socketFactory) {
	var myIoSocket = io.connect(api_url);
	mySocket = socketFactory({
    	ioSocket: myIoSocket
  	});
  	mySocket.on('handshake', function(data) {
		mySocket.emit('typeof', {
			type: 'dashboard'
		});
  	});
  	return mySocket;
});