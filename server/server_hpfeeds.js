var sys = require('sys');
var url = require('url');
var app = require('http').createServer(handler);
var fs = require('fs');
var util = require('util');
var ns = require('node-static');
var io = require('socket.io').listen(app);
var hpfeeds = require('hpfeeds');
var file = new(ns.Server)("../static/", { cache: 600 });

eval(fs.readFileSync('server_hpfeeds_config.js').toString());

// Listen and drop privileges
app.listen(config.port);
process.setuid(config.uid);

// hp feed
var feedconn = new hpfeeds.HPC(
  config.hpfeeds.server,
  config.hpfeeds.port,
  config.hpfeeds.ident,
  config.hpfeeds.auth
);
feedconn.onready(function() { feedconn.subscribe('geoloc.events'); });

// Serve static content
function handler (req, res) {
  try {
    console.log('New request: ' + req.connection.remoteAddress + ': ' + url.parse(req.url).href);
    req.addListener('end', function() {
      file.serve(req, res, function(err, result) {
        if (err) {
          console.error('Error serving %s: %s', req.url, err.message);
          if (err.status === 404 || err.status === 500) {
            file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
          } else {
            res.writeHead(err.status, err.headers);
            res.end();
          }
        }
      });
    });
  } catch(err) {
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

// Push feed data to all connected sockets
feedconn.msgcb = function(id, chan, data) {
  if(data != null) {
    io.sockets.emit('marker', {
      latitude: data.latitude, longitude: data.longitude,
      latitude2: data.latitude2, longitude2: data.longitude2,
      type: data.type, md5: data.md5
    });
  }
}
