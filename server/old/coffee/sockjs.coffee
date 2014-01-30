class Transport
  constructor: (http) ->
    @sockjs = require('sockjs')

    @clients = {}

    server = @sockjs.createServer()

    # Clean up on disconnect
    server.on 'connection', (socket) =>
      @clients[socket.id] = socket

      socket.on 'close', =>
        delete @clients[socket.id]

    server.installHandlers(http.http, { prefix: '/data' })


  broadcast: (instance, data) ->
    json = JSON.stringify(data)
    socket.write(json) for _, socket of @clients
