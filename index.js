const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

const options = {
	key: fs.readFileSync('./ssl_cert/key.pem'),
	cert: fs.readFileSync('./alt_cert/ca.crt')
};

const https_server = https.createServer(options, app);



// --> routing

app.get('/', (req, res) => {
	console.log('yo, someones here!');
	res.json({msg: 'yo, bitch'});
});


const listener = https_server.listen(3000, () => {
	console.log('server started, listening on port 3000');
});


// --> socket



const io = require('socket.io')(listener);

io.on('connection', (socket) => {
	console.log('new connection, lmao');


	socket.on('new_action', (data) => {
		console.log(' made a new action: ' + data);
		io.sockets.emit('response', {msg: "this is a response"})
	});
	
	socket.on('disconnect', (err) => {
		console.log('disconnected:');
		console.log(err);
	})
	
	socket.on('error', (err) => {
		console.log('error!');
		console.log(err)
	});

});


