class Feed
  constructor: (map, log) ->
    @map = map
    @log = log
    @socket = io.connect('/');
    @socket.on("marker", @handler)

  handler: (data) =>
    lat1 = data.latitude
    lng1 = data.longitude
    return unless lat1 and lng1
    src = new Marker(@map, lat1, lng1, data.type, "src", data.countrycode, data.city)
    return if src.x == 0 and src.y == 0
    lat2 = data.latitude2
    lng2 = data.longitude2
    if lat2 and lng2
      dst = new Marker(@map, lat2, lng2, data.type, "dst", data.countrycode2, data.city2)
      if dst.x == 0 and dst.y == 0 then dst = null
    @addLog(src, dst, data.md5)
    @map.addMarker(src)
    @map.addMarker(dst) if dst

  addLog: (src, dst, md5) ->
    return unless src.regionName()
    timestamp = new Date().toTimeString().substring(0,8)
    attacktype = if src.eventName == "thug.events" then "scan" else "attack"
    logstr  = """
              <div class="log_timestamp">#{timestamp}</div> 
              <div class="log_bracket">&lt;</div>#{src.eventName}<div class="log_bracket">&gt;</div> 
              New #{attacktype} from <div class="log_country">#{src.location()}</div> 
              <small>#{src.name()}</small>
              """
    if dst and dst.regionName()
      logstr += " to <div class=\"log_country\">#{dst.location()}</div> <small>#{dst.name()}</small>"
    if md5
      logstr += " <div class=\"log_bracket2\">[</div>" + \
                "<div class=\"log_info\"><a href=\"http://www.virustotal.com/search/?query=#{md5}\">#{md5.substr(0,9)}</a></div>" + \
                "<div class=\"log_bracket2\">]</div>"
    @log.add logstr
