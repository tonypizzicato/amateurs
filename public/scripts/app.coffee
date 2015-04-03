define ['marionette', 'stepform', 'bootstrap.dropdown', 'bootstrap.tab', 'owl', 'news', 'gallery', 'masonry'], (Marionette, StepForm) ->
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

        $('.owl-carousel').each (i, item)->
          console.log item
          $(item).owlCarousel
            navigation : true
            pagination : $(item).data('pagination')
            slideSpeed : 300
            paginationSpeed : 400
            items: $(item).data('items'),
            singleItem: $(item).data('items') == 1
            navigationText: [$(item).data('prev'), $(item).data('next')]
            scrollPerPage: true

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



        $.fn.serializeObject = ->
            o = {}
            a = @serializeArray()
            $.each a, ->
                if o[@name] != undefined
                    if !o[@name].push
                        o[@name] = [ o[@name] ]
                    o[@name].push @value or ''
                else
                    o[@name] = @value or ''
                return
            o
    App
