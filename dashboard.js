#!/usr/bin/env node

sys     = require('util');
express = require('express');
http = require('http');
twitter = require('ntwitter');

app = express();
//app.configure(function(){
  app.use(express.static(__dirname + '/public'));
//});

app.get('/', function(req, res, next){
  res.render('/public/index.html');
});
server = http.createServer(app)
server.listen(8081);
console.log('Server running at http://localhost:8081/');

var io  = require('socket.io').listen(server);
io.set('log level', 0);

myList = [];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
    socket.on('data', function(action,data) {
	if(action==='+') {
        	myList.push(data);
	}
	if(action==='-') {
		myList.del(data);
	}
	if(action==='*') {
            twit.updateStatus(data,
                function (err, data) {
//                  console.log(data);
                });
	}
    });
    socket.on('getfilter', function() {
        socket.emit('pushfilter', myList);
    });
    if(myList.length!=0) {
        twit.stream('user',{track:myList}, function(stream) {
            stream.on('data', function (tweet) {
  	    	    socket.emit('message', JSON.stringify(tweet));
            });
        });
    }   
});

function CreateTwitter() {
twit = new twitter({
  consumer_key:         'A3UZOtL5Z2fxZZbq0mL4NIJrr',
  consumer_secret:      'P4t1dHWdQ5Df74Tm5DrBz6OvzvDNxIp3sLUL3gPemZyQRggofs',
  access_token_key:     '2454624530-FoSscBSEMbSRgi0i0njdYeNStacu3Lhr6Q7RGlq',
  access_token_secret:  'VAy9LulcPs9BiCXBNu1cMDUkIGtxx7tIXBK1jCBE8M60m'
});
}
