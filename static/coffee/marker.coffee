class Marker

  constructor: (map, lat, lng, type, regionCode, cityName) ->
    @map = map
    @lat = lat
    @lng = lng
    @type = type
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

  id: ->
    @lat + "," + @lng

  name: ->
    "(" + @lat + ", " + @lng + ")"

  gps: ->
    [ @lat, @lng ]

  regionCode: ->
    @rc ||= @map.regionCode(@x, @y)

  regionName: ->
    @map.mapObj.getRegionName(@regionCode()) if @regionCode()

  setCaption: (caption) ->
    @map.markerCaptions[@id()] = caption
