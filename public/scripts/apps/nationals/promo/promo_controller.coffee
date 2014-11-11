define ['app', 'apps/nationals/promo/promo_view'], (App, PromoView)->
    show: ()->
        new PromoView.Layout el: 'body'
