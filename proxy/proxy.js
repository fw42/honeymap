var http = require('http'), httpProxy = require('http-proxy');

var backend_nginx = new httpProxy.HttpProxy({ target: { host: 'localhost', port: 81 } });
var backend_socketio = new httpProxy.HttpProxy({ target: { host: 'localhost', port: 82 }});

// Redirect socket.io requests to socket.io and static content to nginx
var server = http.createServer(function(req, res) {
  if(req.url.match(/^\/socket\.io\//)) {
    backend_socketio.proxyRequest(req, res);
  } else {      
    backend_nginx.proxyRequest(req, res);
  }
});

// Redirect websocket requests to the socket.io server
server.on('upgrade', function(req, socket, head) {
  backend_socketio.proxyWebSocketRequest(req, socket, head);
});

server.listen(80);

// Drop privileges
process.setuid(1000);
