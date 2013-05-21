class Transport
  constructor: (instance, handler) ->
    @socket = io.connect('/')
    @socket.on(instance, handler)
