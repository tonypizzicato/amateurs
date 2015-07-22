$ = require 'jquery'
_ = require 'underscore'

WithMasonryItem =

    _classes: ()->
        _.defaults {
            "hidden": 'masonry-item__hidden_yes'
        }, this._super()

    _selectors: ()->
        _.defaults {
            "masonry-item": '.js-masonry-item'
        }, this._super()

    initialize: ()->
        @._super()

        this._elem('masonry-item').removeClass(this._class('hidden'))


module.exports = WithMasonryItem
