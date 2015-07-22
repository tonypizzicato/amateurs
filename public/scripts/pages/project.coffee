_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'

WithImages = require '../mixins/with-images.coffee'
WithMasonryItem = require '../mixins/with-masonry-item.coffee'

ProjectPage = Backbone.View.mix(WithImages).extend

    initialize: ()->
        this._super()

        console.log 'initialize project page'


module.exports = ProjectPage
