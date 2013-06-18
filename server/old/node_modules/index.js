var net = require('net');
var crypto = require('crypto');

var OP_ERROR	= 0;
var OP_INFO		= 1;
var OP_AUTH		= 2;
var OP_PUBLISH	= 3;
var OP_SUBSCRIBE	= 4;
var BUFSIZ = 16384;
var MAXBUF = 1024*1024;

function msghdr(op, data) {
	var l = 5 + data.length;
	var obuf = new Buffer(l);
	obuf.writeInt32BE(l, 0);
	obuf.writeUInt8(op, 4);
	data.copy(obuf, 5);
	return obuf;
}

function msgsubscribe(ident, chan) {
	var l = Buffer.byteLength(ident);
	var l2 = Buffer.byteLength(chan);
	var buf = new Buffer(1+l+l2);
	buf.writeUInt8(l, 0);
	buf.write(ident, 1, l);
	buf.write(chan, 1+l);
	return msghdr(OP_SUBSCRIBE, buf);
}

function msgauth(rand, ident, secret) {
	var hashobj = crypto.createHash('sha1');
	hashobj.update(rand);
	hashobj.update(secret, 'ascii');
	var hash = hashobj.digest('binary');
	var hashbuf = new Buffer(20);
	hashbuf.write(hash, 'binary');
	var l = Buffer.byteLength(ident);
	var buf = new Buffer(1+l+20);
	buf.writeUInt8(l, 0);
	buf.write(ident, 1, l);
	hashbuf.copy(buf, 1+l);
	return msghdr(OP_AUTH, buf);
}

var HPC = function(host, port, ident, secret, timeout, reconnect, sleepwait) {
	var self = this;

	timeout = timeout || 3;
	reconnect = reconnect || true;
	sleepwait = sleepwait || 20;

	var brokername = 'unknown';
	var buflen = 0;
	var ready = false;
	var buf;
	var conn;

	this.connectcb = null;
	this.msgcb = null;

	function onconnect() {
		console.log('connected to backend');
		buf = new Buffer(MAXBUF);
	}
	function onclose() {
		ready = false;
		console.log('connection to backend closed');
		setTimeout(self.connect, 1000);
	}
	function ondata(data) {
		if (data.length+buflen > MAXBUF) { console.log('MAXBUF VIOLATION, closing'); conn.end(); return; }
		data.copy(buf, buflen, 0, data.length);
		buflen += data.length;

		while (buflen > 5) {
			var ml = buf.readInt32BE(0);
			var opcode = buf.readUInt8(4);
			if (ml > MAXBUF) { console.log('MAXBUF VIOLATION, closing'); conn.end(); break; }
			if (buflen < ml) break;

			//var data = buf.substring(5, ml);
			var data2 = buf.slice(5, ml);
			//buf = buf.substring(ml);
			self.handle(opcode, data2);
			buf.copy(buf, 0, ml, buf.length);
			buflen -= ml;
		}
		
	}
	function onerror(exception) {
		ready = false;
		console.log('onerror', exception);
		setTimeout(self.connect, 1000);
	}
	this.subscribe = function(chaninfo) {
		conn.write(msgsubscribe(ident, chaninfo));
	}
	this.connect = function() {
		conn = new net.Socket();
		console.log('connecting to backend', host, port);
		conn.connect(port, host, onconnect);
		conn.on('end', onclose);
		conn.on('data', ondata);
		conn.on('error', onerror);
	}
	this.isready = function() {
		return conn.writable;
	}
	this.onready = function(handler) {
		self.connectcb = handler;
		if (ready) handler();
	}
	this.handle = function(opcode, data) {
		if (opcode == OP_INFO) {
			var l = data.readUInt8(0);
			var name = data.slice(1, 1+l);
			var rand = data.slice(1+l);
			brokername = name.toString();
			conn.write(msgauth(rand, ident, secret));
			ready = true;
			self.connectcb && self.connectcb();
		} else if (opcode == OP_PUBLISH) {
			var l = data.readUInt8(0);
			var m_ident = data.slice(1, 1+l).toString();
			var l2 = data.readUInt8(1+l);
			var m_chan = data.slice(1+1+l, 1+1+l+l2).toString();
			var payload = data.slice(1+1+l+l2);

			try { var dec = JSON.parse(payload); }
			catch (err) {
				console.log('json error', payload);
			}
			self.msgcb && self.msgcb(m_ident, m_chan, dec);
		} else if (opcode == OP_ERROR) {
			console.log('op_error:', data.toString());
		} else {
			console.log('unknown opcode.', opcode);
		}
	}

	this.connect();
}

function wrap(obj, fn) {
	return function wrap2() {
		return fn.apply(obj, arguments);
	}
}

exports.HPC = HPC;
