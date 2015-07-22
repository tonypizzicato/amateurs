_ = require 'underscore'
Backbone = require 'backbone'

Backbone.View.prototype._selectors = ()->
    return {}

Backbone.View.prototype._classes = ()->
    return {}

Backbone.View.prototype._elem = (selector) ->
    if this._selectors()[selector]
        return this.$el.find(this._selectors()[selector])
    if this._classes()[selector]
        return this.$el.find('.' + this._classes()[selector])

    throw new Error 'Selector for ' + selector + ' is not defined'

Backbone.View.prototype._class = (cls) ->
    if this._classes()[cls]
        return this._classes()[cls]

    throw new Error 'Class for ' + cls + ' is not defined'

Backbone.View.prototype._selector = (selector) ->
    if this._selectors()[selector]
        return this._selectors()[selector]

    throw new Error 'Selector for ' + selector + ' is not defined'


module.exports = Backbone;
