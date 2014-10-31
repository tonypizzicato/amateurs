define ['app'], (App)->

    Router = Marionette.AppRouter.extend
        appRoutes:
            'nationals/promo(/)': 'showPromoPage'

    API =
        showPromoPage: ()->
            require ['apps/nationals/promo/promo_controller'], (PromoController)->
                PromoController.show()

    App.addInitializer ()->
        new Router controller: API
