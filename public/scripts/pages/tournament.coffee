$ = require 'jquery'
_ = require 'underscore'
require 'owl.carousel',

Backbone = require '../utils/backbone.coffee'

ProjectPage = require './project.coffee'

WithTabs = require '../mixins/with-tabs.coffee'

TournamentPage = ProjectPage.mix(WithTabs).extend

    _selectors: ()->
        _.defaults {
            "carousel": '.js-carousel'
        }, this._super()

    initialize: ()->
        this._super()

        console.log 'initialize tournament page'

        this._initCarousel()
#        this._initGallery()

    _initCarousel: ()->

        this._elem('carousel').each (i, item)->
            $(item).owlCarousel
                nav: true
                loop: true
                dots: $(item).data('pagination')
                items: $(item).data('items')
                navText: [$(item).data('prev'), $(item).data('next')]


module.exports = TournamentPage
