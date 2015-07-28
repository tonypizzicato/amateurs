$ = require 'jquery'
_ = require 'underscore'
require 'waypoints'

WithStickyMenu =

    _classes: ()->
        _.defaults {
            "loaded": 's_image__loaded'
        }, this._super()

    _selectors: ()->
        _.defaults {
            "submenu": '.js-submenu'
        }, this._super()

    initialize: ()->
        this._super()

        this._initWaypoints()

    _initWaypoints: ()->
        this._elem('submenu').waypoint ()->
            $(this.element).toggleClass 'navbar_state_stuck'

module.exports = WithStickyMenu
