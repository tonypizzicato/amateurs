window.jQuery = $ = require 'jquery'
React = require 'react'

Backbone = require 'backbone'
Marionette = require 'backbone.marionette'

PageClasses = require './page-classes.coffee'

Router = Backbone.Router.extend
    routes:
        'tournaments/:tournament/matches/:id': 'match'
        'tournaments/:tournament': 'tournament'
        'tournaments/:tournament/teams/:id': 'team'
        'tournaments/:tournament/fields': 'fields'
        'tournaments/:tournament/stuff': 'stuff'
        'contacts': 'contacts'
        'fields': 'fields'
        '/stuff': 'stuff'
        'about': 'about'
        '': 'index'
        'promo/nationals.html': 'promo'
        '*notFound': 'notFound'


appRouter = new Router()

appRouter.on 'route:index', ()->
    new PageClasses.IndexPage el: $('.container')

appRouter.on 'route:tournament', ()->
    new PageClasses.TournamentPage el: $('.container')

appRouter.on 'route:team', ()->
    new PageClasses.TeamPage el: $('.container')

appRouter.on 'route:match', ()->
    new PageClasses.MatchPage el: $('.container')

appRouter.on 'route:contacts', ()->
    new PageClasses.ContactsPage el: $('.container')

appRouter.on 'route:fields', ()->
    new PageClasses.FieldsPage el: $('.container')

appRouter.on 'route:stuff', ()->
    new PageClasses.StuffPage el: $('.container')

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
