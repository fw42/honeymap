class Honeymap

  constructor: (config) ->

    @hits =
      region: {}
      marker: {}

    @mapElem = jQuery('#world-map')
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
        label.append(event_count_summary(@hits.region[code]))
      onMarkerLabelShow: (ev, label, code) =>
        label.html(markercaptions[code])
        label.append(event_count_summary(@hits.marker[code]))
    )

    @mapObj = @mapElem.vectorMap('get', 'mapObject')
    @mapObj.regions['US'].config.name = "USA"

    @fitSize()

  fitSize: ->
    console.log("fitSize() called")
    console.log(jQuery(document).width())
    console.log(jQuery(document).height())
    @mapElem.width(jQuery(document).width() - 100)
    @mapElem.height(0.8 * jQuery(document).height())

config =
  markers_visible: 150
  colors:
    src: { fill: 'red',     stroke: 'darkred' }
    dst: { fill: '#F8E23B', stroke: '#383F47' }
    scale: [ '#FFFFFF', '#0071A4' ]

honeymap = new Honeymap(config)

resizeHandler = ->
  console.log("resizeHandler() called")
  honeymap.fitSize()

jQuery(window).resize(resizeHandler)
