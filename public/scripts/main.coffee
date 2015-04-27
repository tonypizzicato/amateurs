require.config
    baseUrl: '/scripts'
    paths:
        'jquery':              '../vendor/jquery/jquery.min'
        'underscore':          '../vendor/underscore/underscore'
        'backbone':            '../vendor/backbone/backbone'
        'backbone.babysitter': '../vendor/backbone.babysitter/lib/backbone.babysitter'
        'backbone.wreqr':      '../vendor/backbone.wreqr/lib/backbone.wreqr'
        'marionette':          '../vendor/marionette/lib/backbone.marionette'
        'handlebars':          '../vendor/require-handlebars-plugin/hbs'
        'waypoints':           '../vendor/jquery-waypoints/waypoints'
        'imageScroll':         '../vendor/Parallax-ImageScroll/jquery.imageScroll'
        'bootstrap.dropdown':  '../vendor/bootstrap-sass/vendor/assets/javascripts/bootstrap/dropdown'
        'bootstrap.tab':       '../vendor/bootstrap-sass/vendor/assets/javascripts/bootstrap/tab'
        'owl':                 '../vendor/owlcarousel/owl-carousel/owl.carousel'
        'photoswipe':          '../vendor/photoswipe/dist/photoswipe'
        'photoswipe.ui':       '../vendor/photoswipe/dist/photoswipe-ui-default'
        'masonry':             '../vendor/masonry/dist/masonry.pkgd'
        'imagesLoaded':        '../vendor/imagesloaded/imagesloaded.pkgd'
        'async':               '../vendor/requirejs-plugins/src/async'

    shim:
        'underscore':
            exports: '_'
        'backbone':
            deps: ['jquery', 'underscore']
            exports: 'backbone'
        'backbone.babysitter':
            deps: ['backbone']
        'backbone.wreqr':
            deps: ['backbone']
        'marionette':
            deps:        ['backbone']
            exports: 'Marionette'
        'handlebars':
            exports: 'Handlebars'
        'waypoints':
            deps: ['jquery']
        'imageScroll':
            deps: ['jquery']
        'bootstrap.dropdown':
            deps: ['jquery']
        'bootstrap.tab':
            deps: ['jquery']

require ['app', 'jquery'], (app, $)->
    app.start()

