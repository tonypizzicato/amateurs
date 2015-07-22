$ = require 'jquery'
_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'
require 'bootstrap'

Tabs = require '../elements/lazy-tabs.coffee'


WithLazyTabs =

    _selectors: ()->
        _.defaults {
            "tabs": '.js-tabs'
        }, this._super()

    initialize: ()->
        @._super();

        @._initTabs()

    _initTabs: ()->
        this._elem('tabs').each (i, el) ->
            new Tabs
                el: el

module.exports = WithLazyTabs
