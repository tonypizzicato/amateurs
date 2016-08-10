window.jQuery = $ = require 'jquery'
Snap = require 'snapsvg'
require '../../../node_modules/waypoints/lib/noframework.waypoints.js'

$ ->
    context = document.getElementById('content')

    $('.header__join').addClass 'fadeIn'

    new Waypoint(
        element: document.getElementById('join')
        context: context
        offset: '50%'
        handler: () ->
            $('.section-join__content').addClass 'fadeInUp'
            $('.section-join__video').addClass 'fadeInUp'
    )
    new Waypoint(
        element: document.getElementById('members')
        context: context
        offset: '70%'
        handler: () ->
            $('.section-members__title').addClass 'fadeIn'
    )
    new Waypoint(
        element: document.getElementById('members-list')
        context: context
        offset: '50%'
        handler: () ->
            $('.section-members__item-wrapper').addClass 'fadeInUp'
    )
    new Waypoint(
        element: document.getElementById('map')
        context: context
        offset: '50%'
        handler: () ->
            $('.section-map__content').addClass 'fadeInUp'
            $('.section-map__pointer').addClass 'fadeInDown'
    )
    new Waypoint(
        element: document.getElementById('devices')
        context: context
        offset: '50%'
        handler: () ->
            $('.section-devices__title').addClass 'fadeIn'
            $('.section-devices__text').addClass 'fadeIn'
            $('.section-devices__button').addClass 'fadeInUp'
    )

    morphEl = document.getElementById 'morph-shape'
    s = Snap(morphEl.querySelector 'svg')
    path = s.select 'path'
    initialPath = path.attr 'd'
    pathOpen = morphEl.getAttribute 'data-morph-open'
    isAnimating = false;
    opened = false

    $('.js-menu-button-open').click(() ->
        isAnimating = true
        opened = true
        $('body').addClass 'show-menu'
        path.animate({ 'path': pathOpen }, 400, mina.easeinout, () -> isAnimating = false)
    )
    $('.js-menu-button-close').click(() ->
        isAnimating = true
        opened = false
        $('body').removeClass 'show-menu'
        setTimeout(() ->
            path.attr('d', initialPath);
            isAnimating = false
        , 300)
    )
    $('.js-content').click(() ->
        if not opened
            return

        opened = false
        isAnimating = true
        $('body').removeClass 'show-menu'
        setTimeout(() ->
            path.attr('d', initialPath);
            isAnimating = false
        , 300)
    )
