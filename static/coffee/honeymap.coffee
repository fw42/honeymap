###
This file is part of HoneyMap (https://github.com/fw42/honeymap/),
developed within the Honeynet Project (https://www.honeynet.org/),
written by Florian Weingarten, Mark Schloesser, Johannes Gilger.

See website for license and contact information.
###

class Honeymap

  constructor: (config) ->

    @config = config

    @hits =
      region: {}
      regionCount: {}
      marker: {}
    @markers =
      captions: {}
      count: 0

    @mapElem = jQuery('#world-map')
    @fitSize()
    @mapElem.vectorMap(
      backgroundColor: ''
      markerStyle:
        initial:
          fill: config.colors.src.fill
          stroke: config.colors.src.stroke
          r: 3
      series:
        markers: []
        regions: [
          scale: config.colors.scale
          attribute: 'fill'
          normalizeFunction: 'linear'
          values: @hits.region
        ]
      onRegionLabelShow: (ev, label, code) =>
        label.html("<big>" + label.html() + "</big>")
        label.append(Honeymap.eventCountSummary(@hits.region[code]))
      onMarkerLabelShow: (ev, label, code) =>
        label.html(@markerCaptions[code])
        label.append(Honeymap.eventCountSummary(@hits.marker[code]))
    )

    @mapObj = @mapElem.vectorMap('get', 'mapObject')
    @mapObj.regions['US'].config.name = "USA"

  fitSize: ->
    @mapElem.width(jQuery(document).width() - 100)
    @mapElem.height(0.8 * jQuery(document).height())

  updateRegionColors: ->
    # Force recomputation of min and max for correct color scaling
    @mapObj.series.regions[0].params.min = null
    @mapObj.series.regions[0].params.max = null
    # Update data
    @mapObj.series.regions[0].setValues(@hits.regionCount)

  removeOldestMarker: ->
    # only remove src markers
    toremove = jQuery(@mapElem.find("svg g circle.jvectormap-marker[fill=" + @config.colors.src.fill + "]")[0])

    par = toremove.parent()
    @mapObj.removeMarkers([ toremove.attr('data-index') ])

    # Remove parent node too (jVectorMap does not do this by itself)
    par.remove()

  regionCode: (x, y) ->
    efp = jQuery(document.elementFromPoint(x + @mapElem.offset().left, y + @mapElem.offset().top))
    if efp.is('path')
      return efp.attr('data-code')
    else if efp.is('circle') || (efp.is('div') && efp.hasClass('marker_animation'))
      # This is pretty ugly. If we hit an existing marker, make it invisible,
      # recursively look again and then make it visible again.
      efp.hide()
      rc = @regionCode(x, y)
      efp.show()
      return rc
    else
      return null

  incMarkerCount: (marker) ->
    # only count src markers which are within a valid region
    if marker.type == 'src' and rc = marker.regionCode
      @hits.region[rc] ||= {}
      @hits.region[rc][marker.eventName] ||= 0
      @hits.region[rc][marker.eventname]++

    @hits.marker[marker.id] ||= {}
    @hits.marker[marker.id][marker.eventName] ||= 0
    @hits.marker[marker.id][marker.eventName]++

  addMarker: (marker) ->
    marker.animate()
    @updateRegionColors()
    @incMarkerCount(marker)

    # only add new markers to jVectorMap which do not exist yet
    return unless @mapObj.markers[marker.id]

    @markers.count++
    if @markers.count >= config.markersMaxVisible then @removeOldestMarker()
    @mapObj.addMarker(marker.id(), { latLng: marker.gps(), name: marker.name, style: @config.colors[marker.type] }, [])

  @eventCountSummary: (hits) ->
    summary = ""
    total = 0

    for type, count of hits
      if total == 0 then summary += "<hr/>"
      summary += "<b>" + type + "</b>: " + (count || 0) + "<br/>"
      total += count

    if total > 0 then summary += "<hr/><b>total</b>: " + total + " events"
    return summary
