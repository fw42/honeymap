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

  log.add "<b>Welcome to HoneyMap. Hosted, modified and a service provided by</b>"
  log.add "Hispagatos.org, Stealthy-Cybersecurity, Binaryfreedom and Hackerñol,"
  log.add "if you want your honey pot feed added please contact us, rek2!"
  log.add ""

  new Feed(honeymap, log, "geoloc.events")
