class Feed
  constructor: (map, log) ->
    @map = map
    @log = log
    @socket = io.connect('/')
    @socket.on("marker", @handler)

  handler: (data) =>
    lat = data.lat
    lng = data.lng
    marker = new Marker(@map, lat, lng, "socketio_random")
    return unless marker.regionCode
    @map.addMarker(marker)
    @log.add "New event in " + marker.regionName() + " " + marker.name()
