class Transport
  constructor: (instance, handler, log) ->
    @log = log
    @handler = handler
    @connect()

  connect: ->
    @socket = new SockJS('/data')

    @socket.onopen = =>
      @log.add("Connection to back-end established")

    @socket.onclose = =>
      @log.add("Connection to back-end lost :-(")

    @socket.onmessage = (msg) =>
      @handler(JSON.parse(msg.data))
