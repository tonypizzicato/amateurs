window.jQuery = $ = require 'jquery'
require '../../../node_modules/waypoints/lib/noframework.waypoints.js'

$ ->
    $('.header__join').addClass 'fadeIn'

    new Waypoint(
        element: document.getElementById('join'),
        offset: '50%'
        handler: () ->
            $('.section-join__content').addClass 'fadeInUp'
            $('.section-join__video').addClass 'fadeInUp'
    )
    new Waypoint(
        element: document.getElementById('members'),
        offset: '70%'
        handler: () ->
            $('.section-members__title').addClass 'fadeIn'
    )
    new Waypoint(
        element: document.getElementById('members-list'),
        offset: '50%'
        handler: () ->
            $('.section-members__item-wrapper').addClass 'fadeInUp'
    )
    new Waypoint(
        element: document.getElementById('map'),
        offset: '50%'
        handler: () ->
            $('.section-map__content').addClass 'fadeInUp'
            $('.section-map__pointer').addClass 'fadeInDown'
    )

#    $('#join').waypoint () ->
#        console.log 'wp 1 reached'
#        $('#join').addClass 'fadeInUp'
