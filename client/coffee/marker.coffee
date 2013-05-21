class Marker
  constructor: (map, lat, lng, eventName, type, regionCode, cityName) ->
    @map = map
    @lat = lat
    @lng = lng
    @type = type || "src"
    @eventName = eventName || "other"
    point = @map.mapObj.latLngToPoint(@lat, @lng)
    @x = point.x
    @y = point.y
    @regionCode = regionCode || @map.regionCode(@x, @y)
    @cityName = cityName

  animate: ->
    cssClass = if @type == 'dst' then 'markerdst' else 'markersrc'
    @map.mapElem.append(
      jQuery('<div class="marker_animation ' + cssClass + '"></div>')
      .css('left', @x + 'px')
      .css('top', @y + 'px')
      .css({ opacity: 1, scale: 0 })
      .transition({ opacity: 0, scale: 1 }, 1000, 'linear', ->
        jQuery(this).remove()
      )
    )

  caption: ->
    caption  = "<small>(" + @lat + ", " + @lng + ")</small><br/>"
    caption += "<big>" + @cityName + "</big> (" + @regionCode + ")" if @cityName
    return caption

  id: -> @lat + "," + @lng
  name: -> "(" + @lat.toFixed(2) + ", " + @lng.toFixed(2) + ")"
  gps: -> [ @lat, @lng ]
  regionName: -> @map.regionName(@regionCode) if @regionCode
  location: -> (if @cityName then @cityName + ", " else "") + @regionName()
