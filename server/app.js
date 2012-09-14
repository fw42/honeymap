var app = require('http').createServer(handler);
var fs = require('fs');
var util = require('util');
var ns = require('node-static');
var io = require('socket.io').listen(app);

var file = new(ns.Server)("../static/", { cache: 600 });

app.listen(1337);

function handler (req, res) {
  req.addListener('end', function() {
    file.serve(req, res, function(err, result) {
      if (err) {
        console.error('Error serving %s - %s', req.url, err.message);
        if (err.status === 404 || err.status === 500) {
          file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
        } else {
          res.writeHead(err.status, err.headers);
          res.end();
        }
      }
    });
  });
}

io.sockets.on('connection', function (socket) {
  function random_point() {
    var lat, lng;
    lat = Math.random() * 180 - 90;
    lng = Math.random() * 360 - 180;
    socket.emit('marker', { lat: lat, lng: lng });
  }
  setInterval(function() { setTimeout(random_point, Math.random() * 1000) }, 500);
});
