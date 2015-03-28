define ['app'], (App)->
    Router = Marionette.AppRouter.extend
        appRoutes:
            'tournaments': 'show'


    API =
        show: ()->
            require ['apps/fields/show/show_controller'], (ShowController)->
                ShowController.show()

    App.addInitializer ()->
        new Router controller: API
