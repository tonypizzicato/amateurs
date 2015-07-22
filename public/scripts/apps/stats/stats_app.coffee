Marionette = require 'backbone.marionette'

Router = Marionette.AppRouter.extend
    appRoutes:
        ':city/tournaments/:tournament/stats': 'showStatsPage'
        '/': 'index'

    controller:
        showStatsPage: ()->
            console.log 'showStatsPage action called'
            StatsController = require './show/show_controller.coffee'
            StatsController.show()

        index: ()->
            console.log 'index action called'

module.exports = Router

