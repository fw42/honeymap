HoneyMap nodejs-http-proxy
==========================

Use this to multiplex nginx (for static content) and
the honeymap nodejs backend (for socket.io content)
on the same port (80).

HAProxy HTTP/WebSocket multiplexing
===================================

Alternatively you can use the haproxy.cfg in this directory to offer HTTP and
Websockets on the same frontend port, with the services in the backend running
on different ports.
