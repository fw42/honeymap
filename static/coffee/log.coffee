class Log
  constructor: (config) ->
    @elem = jQuery("#log")
    @max = config.markersMaxVisible
    @fitSize()

  fitSize: ->
    @elem.width(0.5 * jQuery(document).width())
    @elem.css("margin-top", 0.03 * jQuery(document).height())
    @elem.height(0.15 * jQuery(document).height())

  clearOld: ->
    entries = @elem.find("div.log_entry")
    if entries.length >= @max
      console.log("clearing")
      entries.slice(0, entries.length/2).remove()
      @elem.find("br").nextUntil('div.log_entry', 'br').remove()

  add: (msg) ->
    @clearOld()
    # only automatically scroll down if the user did not manually scroll up before
    scroll = (@elem.scrollTop() + @elem.innerHeight() == @elem[0].scrollHeight)
    @elem.append('<div class="log_entry">' + msg + '</div><br/>')
    if scroll then @elem.scrollTop(@elem[0].scrollHeight)
