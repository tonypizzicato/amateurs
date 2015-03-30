define ['marionette', 'bootstrap.dropdown', 'bootstrap.tab', 'owl', 'news', 'gallery'], (Marionette) ->
    App = new Marionette.Application()

    App.on 'start', ()->
        console.log 'app started'

    App.on 'start', ()->
        require ['imageScroll'], ()->
            $('.img-holder').imageScroll
                extraHeight: 500

        if location.hash != ''
          $('a[href="' + location.hash + '"]').tab('show')

        $('a[data-toggle="tab"]').on 'shown.bs.tab', (e) ->
          if history.pushState
            history.pushState(null, null, '#'+$(e.target).attr('href').substr(1))
          else
            location.hash = '#'+$(e.target).attr('href').substr(1)

        $('.js-country-link').click (e)->
            e.preventDefault()
            $(@).parent().toggleClass 'country_active_yes'

        $('.js-country-link').click (e)->
            e.preventDefault()
            $(@).parent().toggleClass 'country_active_yes'

        $('.owl-carousel').owlCarousel
          navigation : true
          slideSpeed : 300
          paginationSpeed : 400
          singleItem: true
          navigationText: ['Назад', 'Дальше']


    App
