define ['marionette'], (Marionette) ->
    App = new Marionette.Application()

    App.navigate = (route, options)->
        options = options || {}
        Backbone.history.navigate route, options

    App.getCurrentRoute = ()->
        Backbone.history.fragment


    App.on 'start', ()->
        console.log 'app started'
        if Backbone.history
            require ['apps/nationals/nationals_app'], (NationalsApp)->
                Backbone.history.start pushState: true

    App.on 'start', ()->
        require ['imageScroll'], ()->
            $('.img-holder').imageScroll
                holderClass: 'cover'
                extraHeight: 500
    App
