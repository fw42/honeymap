class Transport
  constructor: (instance, handler, log) ->
    @log = log
    @handler = handler
    @reconnectDelay = 1
    @connect()

  connect: ->
    @socket = new SockJS('/data')

    @socket.onopen = =>
      @reconnectDelay = 1
      @log.add("Connection to back-end established")

    @socket.onclose = =>
      @log.add("Connection to back-end lost :-( Retrying in #{@reconnectDelay}s...")
      setTimeout (=> @reconnect()), @reconnectDelay * 1000

    @socket.onmessage = (msg) =>
      @handler(JSON.parse(msg.data))

  reconnect: ->
    @reconnectDelay += 1 if @reconnectDelay < 5
    @connect()
