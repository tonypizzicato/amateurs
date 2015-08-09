_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'

WithImages = require '../mixins/with-images.coffee'
WithStickyMenu = require '../mixins/with-sticky-menu.coffee'
WithMasonryItem = require '../mixins/with-masonry-item.coffee'
NewsCarousel = require '../elements/news-carousel.coffee'

ProjectPage = Backbone.View.mix(WithStickyMenu, WithImages).extend

    _selectors: ()->
        _.defaults {
            "news": '.js-news'
        }, this._super()

    initialize: ()->
        this._super()

        this._initNews()

    _initNews: ()->
        new NewsCarousel
            el: this._elem 'news'


module.exports = ProjectPage