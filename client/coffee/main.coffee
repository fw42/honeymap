config =
  markersMaxVisible: 150
  colors:
    src: { stroke: 'darkred', fill: 'red', 'data-ignore': 'true' }
    dst: { stroke: '#383F47', fill: '#F8E23B', 'data-ignore': 'true' }
    scale: [ '#FFFFFF', '#0071A4' ]

jQuery(document).ready ->
  log = new Log(config)
  honeymap = new Honeymap(config)

  jQuery(window).resize ->
    honeymap.fitSize()
    log.fitSize()

  log.add "<b>Welcome to HoneyMap. This is a BETA version! Bug reports welcome :-)</b>"
  log.add "Note that this is not <b>all</b> honeypots of the Honeynet Project,"
  log.add "only those who voluntarily publish their captures to hpfeeds!"
  log.add ""

  new Feed(honeymap, log, "geoloc.events")
