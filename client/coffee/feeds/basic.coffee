class Feed
  constructor: (map, log, instance) ->
    @map = map
    @log = log
    transport = new Transport(instance, @handler, log)

  handler: (data) =>
    lat = data.lat
    lng = data.lng
    eventName = data.type
    marker = new Marker(@map, lat, lng, eventName)
    return unless marker.regionCode
    @map.addMarker(marker)
    @log.add "New event in " + marker.regionName() + " " + marker.name()
