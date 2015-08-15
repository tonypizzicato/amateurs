window.jQuery = $ = require 'jquery'
React = require 'react'

Backbone = require 'backbone'
Marionette = require 'backbone.marionette'

PageClasses = require './page-classes.coffee'

Router = Backbone.Router.extend
    routes:
        ':city/tournaments/:tournament/matches/:id': 'match'
        ':city/tournaments/:tournament': 'tournament'
        ':city/tournaments/:tournament/fields': 'fields'
        ':city/contacts': 'contacts'
        ':city/fields': 'fields'
        'about': 'about'
        ':city': 'index'
        'promo/nationals.html': 'promo'
        '*notFound': 'notFound'


appRouter = new Router()

appRouter.on 'route:index', ()->
    new PageClasses.IndexPage el: $('.container')

appRouter.on 'route:tournament', ()->
    new PageClasses.TournamentPage el: $('.container')

appRouter.on 'route:match', ()->
    new PageClasses.MatchPage el: $('.container')

appRouter.on 'route:contacts', ()->
    new PageClasses.ContactsPage el: $('.container')

appRouter.on 'route:fields', ()->
    new PageClasses.FieldsPage el: $('.container')

appRouter.on 'route:about', ()->
    new PageClasses.AboutPage el: $('.container')

appRouter.on 'route:promo', ()->
    new PageClasses.PromoPage el: $('.container')

appRouter.on 'route:notFound', (fragment)->
    new PageClasses.ProjectPage el: $('.container')
    console.log 'notFound route handled', fragment

if Backbone.history
    Backbone.history.start
        pushState: true
