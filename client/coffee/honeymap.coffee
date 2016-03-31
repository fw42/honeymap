###
This file is part of HoneyMap (https://github.com/fw42/honeymap/),
developed within the Honeynet Project (https://www.honeynet.org/),
written by Florian Weingarten, Mark Schloesser, Johannes Gilger.

See website for license and contact information.
###

class Honeymap
  constructor: (config) ->
    @config = config
    @hits = { region: { total: {} }, marker: { total: 0 } }
    @captions = {}
    @mapElem = jQuery('#world-map')
    @fitSize()
    @shootNum = 0
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
          values: {}
        ]
      onRegionLabelShow: (ev, label, code) =>
        label.html("<big>" + label.html() + "</big>")
        label.append(Honeymap.eventCountSummary(@hits.region[code]))
      onMarkerLabelShow: (ev, label, code) =>
        label.html(@captions[code])
        label.append(Honeymap.eventCountSummary(@hits.marker[code]))
    )

    $('#world-map svg').attr('id', 'svg-map')
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
    @mapObj.series.regions[0].setValues(@hits.region["total"])

  removeOldestMarker: ->
    # only remove src markers
    #toremove = jQuery(@mapElem.find("svg g circle.jvectormap-marker[fill=" + @config.colors.src.fill + "]")[0])
    toremove = jQuery(@mapElem.find("svg g path.jvectormap-marker[fill=" + @config.colors.src.fill + "]")[0])
    par = toremove.parent()
    id = toremove.attr('data-index')
    delete(@captions[id])
    @mapObj.removeMarkers([ id ])
    # Remove parent node too (jVectorMap does not do this by itself)
    par.remove()

  regionCode: (x, y) ->
    efp = jQuery(document.elementFromPoint(x + @mapElem.offset().left, y + @mapElem.offset().top))
    if efp.is('path')
      return efp.attr('data-code')
    #else if efp.is('circle') || (efp.is('div') && efp.hasClass('marker_animation'))
    else if efp.is('path') || (efp.is('div') && efp.hasClass('marker_animation'))
      # This is pretty ugly. If we hit an existing marker, make it invisible,
      # recursively look again and then make it visible again.
      efp.hide()
      rc = @regionCode(x, y)
      efp.show()
      return rc
    else
      return null

  regionName: (regionCode) ->
    @mapObj.getRegionName(regionCode)

  incMarkerCount: (marker) ->
    @hits.marker[marker.id()] ||= {}
    @hits.marker[marker.id()][marker.eventName] ||= 0
    @hits.marker[marker.id()][marker.eventName]++
    # only count src markers which are within a valid region
    return unless marker.type == 'src' and rc = marker.regionCode
    @hits.region[rc] ||= {}
    @hits.region[rc][marker.eventName] ||= 0
    @hits.region[rc][marker.eventName]++
    @hits.region["total"][rc] ||= 0
    @hits.region["total"][rc]++

  addMarker: (marker) ->
    marker.animate()
    @captions[marker.id()] = marker.caption()
    @incMarkerCount(marker)
    @updateRegionColors()
    # only add new markers div's to jVectorMap which do not exist yet
    return if @mapObj.markers[marker.id()]
    @hits.marker["total"]++
    if @hits.marker["total"] > config.markersMaxVisible then @removeOldestMarker()
    @mapObj.addMarker(marker.id(), { latLng: marker.gps(), name: marker.name(), style: @config.colors[marker.type] }, [])
    
  drawShoot: (src, dst) ->
    @shootNum++
    shootNum = @shootNum
    mycallback = ()-> 
      $('#shoot-path'+shootNum).remove()
      
    $('#svg-map').html($('#svg-map').html()+@path_form(src, dst))
    new Vivus('svg-map', {duration: 120}, mycallback)
            
  path_form: (fp, sp) ->
    mp = {'x': (fp.x + sp.x)/2, 'y':(fp.y+sp.y)/2 + 30}
    svg = '<g id="shoot-path' + @shootNum + '"><path d="M' + fp.x + ' ' + fp.y + ' Q ' + mp.x + ' ' + mp.y + ', ' + sp.x + ' ' + sp.y + '" stroke="red" fill="transparent"/></g>'
    return svg;

  @eventCountSummary: (hits) ->
    return unless hits?
    total = 0
    summary = "<hr/>"
    for type, count of hits
      count ||= 0
      summary += "<b>#{type}</b>: #{count}<br/>"
      total += count
    summary + "<hr/><b>total</b>: " + total + " events"
