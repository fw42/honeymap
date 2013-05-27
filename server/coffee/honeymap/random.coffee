###
Example honeymap server for serving random markers
###

class HoneymapServer
  constructor: (config) ->
    http = new HttpServer(config.port)
    http.listen()
    transport = new Transport(http)

    randomPoint = ->
      lat = Math.random() * 180 - 90
      lng = Math.random() * 360 - 180
      transport.broadcast("geoloc.events", { lat: lat, lng: lng, type: "random_remote" })

    setInterval((-> setTimeout(randomPoint, Math.random() * 1000) ), 500)
