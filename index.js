require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const mysql = require('mysql')
const server_port = 8928
const socket_port = 8929
const net = require('net');
const sf = require("./socket_communication");
let clients = []
const options = {
	key: fs.readFileSync('./ssl_cert/server.key'),
	cert: fs.readFileSync('./ssl_cert/server.cert')
};
/*
const db = mysql.createConnection({
	host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
})
*/
const https_server = https.createServer(options, app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/*
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql connected..');
});
*/
// --> routing

app.get('/', (req, res) => {
	console.log('yo, someones here!');
	res.json({msg: 'yo, bitch'});
	sendDataToClient(clients[0], "1");
});

app.post('/note', (req, res) => {
  console.log(req.body);
  let data = req.body;
  sf.sendDataToClient(clients[0], data)
});


const listener = https_server.listen(server_port, () => {
	console.log('server started, listening on port ' + server_port);
});


// --> socket

const socket_server = net.createServer({allowHalfOpen: true});
socket_server.on('connection', (socket) => {

	socket.setEncoding('utf-8');

	console.log("new connection!");
	clients.push(socket);
		
	socket.on('data', (data) => {
		// essentially we don't need this, since with 99% certainty
		// the socket communcation will be only server -> client, (no client-> server needed)
		// the client -> server communication will happen not via sockets.
		console.log("received some data!");
		if (data.length > 5) {
			try{
				console.log('successfully received data!');
				console.log(data.toString())
			}catch(err){
				console.log('error while handling incoming data');
				console.log('sent data: ');
				console.log(data.toString());
				console.log('error message: ');
				console.log(err);
			}
		}
	});

	socket.on('end', (data) => {
		console.log('socket ended.');
		console.log(data);
		// just clearing all the clients for now
		// it works (and does what it's supposed to do, since we are always going to just have one client)
		// but it's not super beautiful.
		clients.length = 0;
	});

	socket.on('error', (err) => {
		console.log('error with socket:');
		console.log(err);
	});

	socket.on('close',() => {
		console.log('socket closed.');
		clients.length = 0;
	});
});

socket_server.listen(socket_port, '127.0.0.1');
	
const sendDataToClient = (client, data) => {
  console.log(data);
	client.write(`${data}\n`);
};

