define ['marionette', 'waypoints', ''], (Marionette, waypoints)->
    View = {}

    View.Layout = Marionette.LayoutView.extend
        ui:
            wp1: '.wp1'
            wp2: '.wp2'
            wp3: '.wp3'
            wp4: '.wp4'
            wp5: '.wp5'
            wp6: '.wp6'

        events:
            'click a[href*=#]:not([href=#])': "_scroll"

        initialize: ()->
            @.bindUIElements()
            @._initWaypoints()

        _initWaypoints: ()->
            @.ui.wp1.waypoint ()=>
                @.ui.wp1.addClass('animated fadeInLeft')
            , offset: '75%'

            @.ui.wp2.waypoint ()=>
                @.ui.wp2.addClass('animated fadeInUp')
            , offset: '75%'

            @.ui.wp3.waypoint ()=>
                @.ui.wp3.addClass('animated fadeInDown')
            , offset: '55%'

            @.ui.wp4.waypoint ()=>
                @.ui.wp4.addClass('animated fadeInDown')
            , offset: '75%'

            @.ui.wp5.waypoint ()=>
                @.ui.wp5.addClass('animated fadeInUp')
            , offset: '75%'


            @.ui.wp6.waypoint ()=>
                @.ui.wp6.addClass('animated fadeInDown')
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
    View
