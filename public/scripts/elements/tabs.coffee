$ = require 'jquery'
_ = require 'underscore'
Backbone = require '../utils/backbone.coffee'

require 'bootstrap'

Tabs = Backbone.View.extend

    _selectors: ()->
        _.defaults {
            "tab-item": '.js-tab'
        }, this._super();

    initialize: ()->
        this._super();

        this._initTabs()
        this._initHash()

    _initTabs: ()->
        this._elem('tab-item').on 'shown.bs.tab', (e) ->
            control = $(e.target)

            if Backbone.history.pushState
                Backbone.history.pushState(null, null, '#' + control.attr('href').substr(1))
            else
                location.hash = '#' + control.attr('href').substr(1)

    _initHash: ()->
        if location.hash != '' and this.$el.find('a[href="' + location.hash + '"]')
            this.$el.find('a[href="' + location.hash + '"]').tab('show')

module.exports = Tabs
