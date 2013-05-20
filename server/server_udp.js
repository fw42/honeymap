var sys = require('sys');
var url = require('url');
var app = require('http').createServer(handler);
var fs = require('fs');
var util = require('util');
var ns = require('node-static');
var io = require('socket.io').listen(app);
var file = new(ns.Server)("../static/", { cache: 600 });
var sanitize = require('validator').sanitize;
var dgram = require("dgram");
var geoip = require('geoip-lite');

//eval(fs.readFileSync('server_hpfeeds_config.js').toString());

// Listen and drop privileges
app.listen(8081);
// process.setuid(config.uid);

// Production settings for socket.io
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

var udpserver = dgram.createSocket("udp4");

udpserver.on("listening", function () {
  var address = udpserver.address();
  console.log("udpserver listening " +
      address.address + ":" + address.port);
});

udpserver.bind(41234);

// Serve static content
function handler (req, res) {
  try {
    console.log('New request: ' + req.connection.remoteAddress + ': ' + url.parse(req.url).href);
    file.serve(req, res, function(err, result) {
      if (err) {
        console.error('Error serving %s: %s', req.url, err.message);
        res.writeHead(err.status, err.headers);
        res.end();
      }
    });
  } catch(err) {
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

udpserver.on("message", function (msg, rinfo) {
  console.log("server got: " + msg.toString() + "(" + typeof(msg) + " from " +
    rinfo.address + ":" + rinfo.port);

  try {
    msg = msg.toString();
    msg = msg.replace("\n", "");
  } catch(err) {
    console.log("msg error", err);
    return;
  }

  var data = geoip.lookup(msg);
  // { range: [ 3479299040, 3479299071 ],
  //   country: 'US',
  //   region: 'CA',
  //   city: 'San Francisco',
  //   ll: [37.7484, -122.4156] }
  console.log(" -> lookup data:", data);
  if(data != null) {
    io.sockets.emit('marker', {
      latitude: data.ll[0], longitude: data.ll[1],
      countrycode: data.country, country: data.country, city: data.city,

      // latitude2: data.latitude2, longitude2: data.longitude2,
      // countrycode2: data.countrycode2, country2: data.country2, city2: data.city2,

      // type: data.type ? sanitize(data.type).xss() : null,
      // md5: data.md5 ? sanitize(data.md5).xss() : null
    });
  }
});

io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function() {
    delete socket.namespace.sockets[socket.id];
  })
})
