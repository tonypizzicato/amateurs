_ = require 'underscore'
Backbone = require 'backbone'

Backbone.View.mix = (mixin) ->
    Class = this

    Array.prototype.forEach.call arguments, (mixin)->
    if !_.isObject mixin
        throw new Error 'Mixin must be an object'

    if Class.mixed && Class.mixed.indexOf(mixin) != -1
        return

    Class = Class.extend mixin, {
        mixed: if Class.mixed then Class.mixed.slice(0) else []
    }

    Class.mixed.push mixin

    Class;

module.exports = Backbone;
