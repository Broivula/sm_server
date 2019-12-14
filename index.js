const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();


const options = {
	key: fs.readFileSync('./ssl_cert/key.pem'),
	cert: fs.readFileSync('./ssl_cert/cert.pem')
};



// --> routing

app.get('/', (req, res) => {
	res.json({msg: 'yo, bitch'});
});

const https_server = https.createServer(options, app);

const listener = https_server.listen(3000, () => {
	console.log('server started, listening on port 3000');
});


// --> socket

const io = require('socket.io')(listener);

io.on('connection', (socket) => {
	console.log('new connection, lmao');
	socket.username = "Desktop";

	socket.on('new_action', (data) => {
		const parsed = JSON.parse(data);
		console.log(socket.username + ' made a new action: ' + parsed);
	});
});
