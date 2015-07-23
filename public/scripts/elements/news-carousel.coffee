$ = require 'jquery'
_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'

NewsCarousel = Backbone.View.extend

    _selectors: ()->
        _.defaults {
            list: '.news__headlines'
            items: '.news__headlines li'
            preview: '.news__preview'
            wp4: '.wp4'
            wp5: '.wp5'
            wp6: '.wp6'
        }, this._super()

    initialize: ()->

        newsList = this._elem 'list'
        newsListItems = this._elem 'items'
        firstNewsItem = newsListItems.first()
        newsPreview = this._elem 'preview'

        elCount = newsList.children(':not(.highlight)').last().index()

        if elCount == -1
            return
        vPadding = parseInt(firstNewsItem.css('padding-top').replace('px', ''), 10) + parseInt(firstNewsItem.css('padding-bottom').replace('px',
            ''), 10)
        vMargin = parseInt(firstNewsItem.css('margin-top').replace('px', ''), 10) + parseInt(firstNewsItem.css('margin-bottom').replace('px', ''),
            10)
        cPadding = parseInt($('.news__content').css('padding-top').replace('px', ''),
            10) + parseInt($('.news__content').css('padding-bottom').replace('px', ''), 10)
        speed = 5000
        siblings = null
        totalHeight = null
        indexEl = 1
        myTimer = null
        i = null
        # the css animation gets added dynamicallly so
        # that the news item sizes are measured correctly
        # (i.e. not in mid-animation)
        # Also, appending the highlight item to keep HTML clean
        newsList.append '<li class="highlight nh-anim"></li>'
        hl = $('.highlight')
        newsListItems.addClass 'nh-anim'
        $('.news__content').on 'mouseover', ->
            clearInterval myTimer
        $('.news__content').on 'mouseout', ->
            doTimedSwitch()

        doEqualHeight = (c) ->
            if newsPreview.height() < newsList.height()
                newsPreview.height newsList.height()
            else if newsList.height() < newsPreview.height() and newsList.height() > parseInt(newsPreview.css('min-height').replace('px', ''), 10)
                newsPreview.height newsList.height()
            if $('.news__content:nth-child(' + c + ')').height() > newsPreview.height()
                newsPreview.height $('.news__content:nth-child(' + c + ')').height() + cPadding

        doTimedSwitch = ->
            myTimer = setInterval((->
                if $('.selected').prev().index() + 1 == elCount
                    firstNewsItem.trigger 'click'
                else
                    $('.selected').next(':not(.highlight)').trigger 'click'
            ), speed)

        doClickItem = ->
            newsListItems.on 'click', (e)->
                e.stopPropagation()
                clearInterval myTimer
                newsListItems.removeClass 'selected'
                $(this).addClass 'selected'
                siblings = $(this).prevAll()
                totalHeight = 0
                # this loop calculates the height of individual elements, including margins/padding
                i = 0
                while i < siblings.length
                    totalHeight += $(siblings[i]).height()
                    totalHeight += vPadding
                    totalHeight += vMargin
                    i += 1
                # this moves the highlight vertically the distance calculated in the previous loop
                # and also corrects the height of the highlight to match the current selection
                hl.css
                    top: totalHeight
                    height: $(this).height() + vPadding
                indexEl = $(this).index() + 1
                $('.news__content:nth-child(' + indexEl + ')').siblings().removeClass 'news__content_visible'
                $('.news__content:nth-child(' + indexEl + ')').addClass 'news__content_visible'
                clearInterval myTimer
                doTimedSwitch()
                doEqualHeight indexEl

        doWindowResize = ->
            $(window).resize ->
                clearInterval myTimer
                # click is triggered to recalculate and fix the highlight position
                $('.selected').trigger 'click'

        doClickItem()
        doWindowResize()
        $('.selected').trigger 'click'

module.exports = NewsCarousel
