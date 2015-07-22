$ = require 'jquery'
event = $.event
resizeTimeout = undefined
event.special.smartresize =
  setup: ->
    $(this).bind 'resize', event.special.smartresize.handler
  teardown: ->
    $(this).unbind 'resize', event.special.smartresize.handler
  handler: (event, execAsap) ->
    # Save the context
    context = this
    args = arguments
    # set correct event type
    event.type = 'smartresize'
    if resizeTimeout
      clearTimeout resizeTimeout
    resizeTimeout = setTimeout((->
      jQuery.event.dispatch.apply context, args
    ), if execAsap == 'execAsap' then 0 else 100)

$.fn.smartresize = (fn) ->
  if fn then @bind('smartresize', fn) else @trigger('smartresize', [ 'execAsap' ])

module.exports = $
