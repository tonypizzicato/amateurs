$ = require 'jquery'
_ = require 'underscore'
require '../../../node_modules/waypoints/lib/jquery.waypoints.js'

Backbone = require '../utils/backbone.coffee'

ProjectPage = require './project.coffee'

PromoPage = ProjectPage.extend

    _selectors: ()->
        _.defaults {
            wp1: '.wp1'
            wp2: '.wp2'
            wp3: '.wp3'
            wp4: '.wp4'
            wp5: '.wp5'
            wp6: '.wp6'
        }

    events:
        'click a[href*=#]:not([href=#])': "_scroll"

    initialize: ()->
        this._super()

        this._initWaypoints()

    initialize: ()->
        this._initWaypoints()

    _initWaypoints: ()->
        this._elem('wp1').waypoint ()=>
            this._elem('wp1').addClass('animated fadeInLeft')
        , offset: '75%'

        this._elem('wp2').waypoint ()=>
            this._elem('wp2').addClass('animated fadeInUp')
        , offset: '75%'

        this._elem('wp3').waypoint ()=>
            this._elem('wp3').addClass('animated fadeInDown')
        , offset: '55%'

        this._elem('wp4').waypoint ()=>
            this._elem('wp4').addClass('animated fadeInDown')
        , offset: '75%'

        this._elem('wp5').waypoint ()=>
            this._elem('wp5').addClass('animated fadeInUp')
        , offset: '75%'


        this._elem('wp6').waypoint ()=>
            this._elem('wp6').addClass('animated fadeInDown')
        , offset: '75%'

    _scroll: (e)->
        el = e.currentTarget
        if location.pathname.replace(/^\//, '') == el.pathname.replace(/^\//, '') && location.hostname == el.hostname
            target = $(el.hash)
            target = if target.length then target else $('[name=' + target.hash.slice(1) + ']')
            if target.length
                $('html,body').animate
                    scrollTop: target.offset().top
                , 1500
                return false


module.exports = PromoPage
