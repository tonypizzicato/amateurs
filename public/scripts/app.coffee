define ['marionette', 'bootstrap.dropdown', 'bootstrap.tab', 'owl', 'news'], (Marionette) ->
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

        $('.carousel').owlCarousel
          navigation : true
          slideSpeed : 300
          paginationSpeed : 400
          singleItem: true
          navigationText: ['Назад', 'Дальше']


    App
