define ['marionette', 'flickity', 'bootstrap.dropdown', 'bootstrap.tab', 'news'], (Marionette, Flickity) ->
    App = new Marionette.Application()

    App.on 'start', ()->
        console.log 'app started'

    App.on 'start', ()->
        require ['imageScroll'], ()->
            $('.img-holder').imageScroll
                extraHeight: 500

        $('.js-country-link').click (e)->
            e.preventDefault()
            $(@).parent().toggleClass 'country_active_yes'

        $('.js-country-link').click (e)->
            e.preventDefault()
            $(@).parent().toggleClass 'country_active_yes'

        new Flickity '.flickity',
            cellAlign: 'left'
            contain: true


    App
