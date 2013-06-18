class Transport
  constructor: (http) ->
    @socketio = require('socket.io').listen(http.http)

    # Production settings for socket.io
    @socketio.enable('browser client minification')  # send minified client
    @socketio.enable('browser client etag')          # apply etag caching logic based on version number
    @socketio.enable('browser client gzip')          # gzip the file
    @socketio.set('log level', 1)                    # reduce logging

    # Clean up on disconnect
    @socketio.sockets.on 'connection', (socket) ->
      socket.on 'disconnect', ->
        delete socket.namespace.sockets[socket.id]

  broadcast: (instance, data) ->
    @socketio.sockets.emit(instance, data)
