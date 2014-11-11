require.config({
    paths:
        'jquery':              '../vendor/jquery/jquery.min'
        'underscore':          '../vendor/underscore/underscore'
        'backbone':            '../vendor/backbone/backbone'
        'backbone.babysitter': '../vendor/backbone.babysitter/lib/backbone.babysitter'
        'backbone.wreqr':      '../vendor/backbone.wreqr/lib/backbone.wreqr'
        'marionette':          '../vendor/marionette/lib/backbone.marionette'
        'handlebars':          '../vendor/require-handlebars-plugin/hbs'
        'waypoints':           '../vendor/jquery-waypoints/waypoints'
        'imagesloaded':        '../vendor/imagesloaded/imagesloaded'

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
            deps: ['backbone']
            exports: 'Marionette'
        'handlebars':
            exports: 'Handlebars'
        'waypoints':
            deps: ['jquery']
        'imagesloaded':
            deps: ['jquery']
});

require ['app', 'jquery'], (app, $)->
    app.start()

