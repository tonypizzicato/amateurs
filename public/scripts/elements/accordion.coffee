$ = require 'jquery'
smartresize = require './smartresize.coffee'

defaults =
    open:          -1
    oneOpenedItem: false
    speed:         600
    easing:        'swing'
    scrollSpeed:   900
    scrollEasing:  'swing'

Accordion = (element, options) ->
    @$el = $(element)
    # list items
    @$items = @$el.children('.js-accordion-item')
    # total number of items
    @itemsCount = @$items.length
    # initialize accordion
    @_init options

Accordion.prototype =
    _init: (options) ->
        @options = $.extend(true, {}, defaults, options)
        # validate options
        @_validate()
        # current is the index of the opened item
        @current = if @options.open > -1 then @options.open else @$items.filter('.accordion__item_opened').index();
        # hide the contents so we can fade it in afterwards
        @$items.filter(':not(.accordion__item_opened)').find('.js-accordion-content').hide()
        if @current > -1
            @$items.eq(@current).find('.js-accordion-content').css({display: 'block'});
        # save original height and top of each item
        @_saveDimValues()
        # if we want a default opened item...
        # if @current != - 1
        # @_toggleItem @$items.eq(@current)
        # initialize the events
        @_initEvents()

    _saveDimValues: ->
        @$items.each ->
            $item = $(this)
            $item.data
                originalHeight: $item.find('.js-accordion-control:first').height()
                offsetTop:      $item.offset().top

    _validate: ->
        # open must be between -1 and total number of items, otherwise we set it to -1
        if @options.open < -1 or @options.open > @itemsCount - 1
            @options.open = -1

    _initEvents: ->
        instance = this
        # open / close item
        @$items.find('.js-accordion-control:first').bind 'click.accordion', (event) ->
            $item = $(this).parent()
            # close any opened item if oneOpenedItem is true
            if instance.options.oneOpenedItem and instance._isOpened() and instance.current != $item.index()
                instance._toggleItem instance.$items.eq(instance.current)
            # open / close item
            instance._toggleItem $item
            false
#            $(window).bind 'smartresize.accordion', (event) ->
#                # reset orinal item values
#                instance._saveDimValues()
#                # reset the content's height of any item that is currently opened
#                instance.$el.find('.accordion__item_opened').each ->
#                    $this = $(this)
#                    $this.css 'height', $this.data('originalHeight') + $this.find('.js-accordion-content').outerHeight(true)
#                # scroll to current
#                if instance._isOpened()
#                    instance._scroll()

    _isOpened: ->
        @$el.find('.accordion__item_opened').length > 0

    _toggleItem: ($item) ->
        $content = $item.find('.js-accordion-content')
        if $item.hasClass('accordion__item_opened')
            @current = -1
            $content.stop(true, true).fadeOut @options.speed
            $item.removeClass('accordion__item_opened').stop().animate({height: $item.data('originalHeight')}, @options.speed, @options.easing)
        else
            @current = $item.index()
            $content.stop(true, true).fadeIn @options.speed
            $item.addClass('accordion__item_opened').stop().animate({height: $item.data('originalHeight') + $content.outerHeight(true)}, @options.speed, @options.easing)
#                @_scroll(@)

    _scroll: (instance) ->
        instance = instance or this
        if instance.current != -1
            current = instance.current
        else
            current = instance.$el.find('.js-accordion-content.accordion__item_opened:last').index()

        $('html, body').stop().animate {
            scrollTop: if instance.options.oneOpenedItem then instance.$items.eq(current).data('offsetTop') else instance.$items.eq(current).offset().top
        }, instance.options.scrollSpeed, instance.options.scrollEasing

module.exports = Accordion
