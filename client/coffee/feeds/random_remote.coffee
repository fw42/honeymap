class Feed
  constructor: (map, log, instance) ->
    @map = map
    @log = log
    transport = new Transport(instance, @handler)

  handler: (data) =>
    lat = data.lat
    lng = data.lng
    marker = new Marker(@map, lat, lng, "random_remote")
    return unless marker.regionCode
    @map.addMarker(marker)
    @log.add "New event in " + marker.regionName() + " " + marker.name()
