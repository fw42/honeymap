###
Honeymap server for serving hpfeeds GPS streams
###

class HoneymapServer
  constructor: (config) ->
    hpfeeds = require('hpfeeds')
    sanitize = require('validator').sanitize
    http = new HttpServer(config.port)
    http.listen()
    transport = new Transport(http)
    feedconn = new hpfeeds.HPC(
      config.hpfeeds.server,
      config.hpfeeds.port,
      config.hpfeeds.ident,
      config.hpfeeds.auth
    )
    feedconn.onready -> feedconn.subscribe('geoloc.events')
    feedconn.msgcb = (id, chan, data) ->
      return unless data
      transport.broadcast(chan, {
        latitude: data.latitude
        longitude: data.longitude
        countrycode: data.countrycode
        city: data.city

        latitude2: data.latitude2
        longitude2: data.longitude2
        countrycode2: data.countrycode2
        city2: data.city2

        type: if data.type then sanitize(data.type).xss() else null
        md5: if data.md5 then sanitize(data.md5).xss() else null
      })
