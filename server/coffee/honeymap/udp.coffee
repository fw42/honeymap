class HoneymapServer
  constructor: (config) ->
    http = new HttpServer(config.port)
    http.listen()
    transport = new Transport(http)

    dgram = require("dgram")
    geoip = require('geoip-lite')
    udpserver = dgram.createSocket("udp4")
    udpserver.bind(41234)

    udpserver.on("listening", ->
      address = udpserver.address()
      console.log("udpserver listening " + address.address + ":" + address.port)
    )

    udpserver.on "message", (msg, rinfo) ->
      console.log("server got: " + msg.toString() + " (" + typeof(msg) + ") from " +
        rinfo.address + ":" + rinfo.port)

      try
        msg = msg.toString()
        msg = msg.replace("\n", "")
      catch err
        console.log("msg error", err)
        return

      data = geoip.lookup(msg)
      # { range: [ 3479299040, 3479299071 ],
      #   country: 'US',
      #   region: 'CA',
      #   city: 'San Francisco',
      #   ll: [37.7484, -122.4156] }
      console.log(" -> lookup data:", data)
      return unless data
      transport.broadcast('geoloc.events', {
        latitude: data.ll[0]
        longitude: data.ll[1]
        countrycode: data.country
        city: data.city
        # latitude2: data.latitude2
        # longitude2: data.longitude2
        # countrycode2: data.countrycode2
        # city2: data.city2
        # type: data.type ? sanitize(data.type).xss() : null
        # md5: data.md5 ? sanitize(data.md5).xss() : null
      })
