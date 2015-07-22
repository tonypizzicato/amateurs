window.jQuery = $ = require 'jquery'
React = require 'react'

Backbone = require 'backbone'
Marionette = require 'backbone.marionette'

StepForm = require './elements/stepform.coffee'
Masonry = require 'masonry-layout'

require './news.coffee'

IndexPage = require './pages/index.coffee'
TournamentPage = require './pages/tournament.coffee'
MatchPage = require './pages/match.coffee'
PromoPage = require './pages/promo.coffee'

Router = Backbone.Router.extend
    routes:
        ':city/tournaments/:tournament/matches/:id': 'match'
        ':city/tournaments/:tournament': 'tournament'
        ':city': 'index'
        'promo/nationals.html': 'promo'
        '*notFound': 'notFound'


appRouter = new Router()

appRouter.on 'route:index', ()->
    new IndexPage el: $('.container')

appRouter.on 'route:tournament', ()->
    new TournamentPage el: $('.container')

appRouter.on 'route:match', ()->
    new MatchPage el: $('.container')

appRouter.on 'route:promo', ()->
    new PromoPage el: $('.container')

appRouter.on 'route:notFound', (fragment)->
    console.log 'notFound route handled', fragment

if Backbone.history
    Backbone.history.start
        pushState: true


App = new Marionette.Application()

App.on 'start', ()->
    console.log 'app started'

App.on 'start', ()->
    if $('.js-map').length
        require('./maps.coffee')


# applications

StatsAppRouter = require './apps/stats/stats_app.coffee'


App.addInitializer ()->
    new StatsAppRouter()

module.exports = App
