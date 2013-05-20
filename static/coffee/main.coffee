config =
  markersMaxVisible: 150
  colors:
    src: { stroke: 'darkred', fill: 'red' }
    dst: { stroke: '#383F47', fill: '#F8E23B' }
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
  log.add "<br/>"

  new Feed(honeymap, log, 500)
