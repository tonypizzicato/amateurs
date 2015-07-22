$ = require 'jquery'
_ = require 'underscore'
Backbone = require '../utils/backbone.coffee'

ProjectPage = require './project.coffee'

Accordion = require '../elements/accordion.coffee'
WithLazyTabs = require '../mixins/with-lazy-tabs.coffee'

IndexPage = ProjectPage.mix(WithLazyTabs).extend

    _selectors: ()->
        _.defaults {
            "accordion": '.js-accordion'
        }, this._super()

    initialize: ()->
        console.log 'initialize index page'
        this._super()

        this._initAccordion()

    _initAccordion: ()->
        $(this._elem('accordion')).each (i, el) ->
            new Accordion el


module.exports = IndexPage
