$ = require 'jquery'
_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'

ProjectPage = require './project.coffee'

WithTabs = require '../mixins/with-masonry-tabs.coffee'

require '../gallery.coffee'

MatchPage = ProjectPage.mix(WithTabs).extend

    initialize: ()->
        this._super()

        $('.js-masonry-item').removeClass('masonry-item__hidden_yes')

        console.log 'initialize match page'


module.exports = MatchPage
