View = require './show_view.coffee'

ShowController =
    show: ()->
        console.log 'show stats'

        new ShowView.StatsView el: $('#main')


module.exports = ShowController
