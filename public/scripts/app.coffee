window.jQuery = $ = require 'jquery'

Marionette = require 'backbone.marionette'

StepForm = require './stepform.coffee'
Accordion = require './accordion.coffee'
imagesLoaded = require 'imagesloaded'
Masonry = require 'masonry-layout'

require 'bootstrap',
require 'owl.carousel',
require './news.coffee',
require './gallery.coffee'

App = new Marionette.Application()

App.on 'start', ()->
    console.log 'app started'

App.on 'start', ()->

    $('a[data-toggle="tab"]').on 'shown.bs.tab', (e) ->
        control = $(e.target)

        unless control.data 'lazy'
            if history.pushState
                history.pushState(null, null, '#' + control.attr('href').substr(1))
            else
                location.hash = '#' + control.attr('href').substr(1)
        else
            unless control.data 'ready'
                $.ajax
                    url: '/lazy/' + control.data('league') + '/' + control.data('route') + '/' + control.data('name')
                    success: (data)->
                        $(control.attr('href')).find('.panel__body').fadeOut(400, ->
                            $(@).html data
                            $(@).fadeIn 500
                        )
                        $(control.attr('href')).parents('.js-accordion-item').css({height: 'auto'})
                        control.data 'ready', true
                    error: ->
                        $(control.attr('href')).find('.panel__body').html 'error'

        msnr = $(control.attr('href')).find('.panel__body .js-masonry-js')
        if msnr.length and !msnr.data('init')
            imagesLoaded msnr, ->
                new Masonry msnr.get(0),
                    itemSelector: ".js-masonry-item"
                    isAnimated: "true",

            msnr.imagesLoaded().progress (imgLoad, image)->
                item = $(image.img).parents '.js-masonry-item'
                item.addClass('animated')
            msnr.data 'init', true


    if location.hash != ''
        $('a[href="' + location.hash + '"]').tab('show')


    $('.js-country-link').click (e)->
        e.preventDefault()
        $(@).parent().toggleClass 'country_active_yes'

    $('.js-country-link').click (e)->
        e.preventDefault()
        $(@).parent().toggleClass 'country_active_yes'

    $('.owl-carousel').each (i, item)->
        $(item).owlCarousel
            nav: true
            loop: true
            dots: $(item).data('pagination')
            items: $(item).data('items')
            navText: [$(item).data('prev'), $(item).data('next')]

    $('.js-masonry-item').removeClass('masonry-item__hidden_yes')

    if $('.js-contacts-form').length
        new StepForm $('.js-contacts-form')[0],
            onSubmit: ()->
                $.post '/orders', $('.js-contacts-form').serializeObject()

                console.log 'submitted'
                $('.js-stepform-inner').addClass 'hide'
                $('.final-message').addClass 'show'
                setTimeout ->
                    $('.final-message').removeClass 'show'
                    $('.js-contacts-form').removeClass 's_mb_40'
                    $('.js-contacts-form').addClass 'hide'
                , 3000

    $('.js-accordion').each (i, el) ->
        new Accordion el

    $('.js-image').each ->
        $(@).attr 'src', $(@).data('src')
        @.onload = ()=>
            $(@).addClass 's_image__loaded'

    if $('.js-map').length
        require('./maps.coffee')

    $.fn.serializeObject = ->
        o = {}
        a = @serializeArray()
        $.each a, ->
            if o[@name] != undefined
                if !o[@name].push
                    o[@name] = [o[@name]]
                o[@name].push @value or ''
            else
                o[@name] = @value or ''
            return
        o
module.exports = App
