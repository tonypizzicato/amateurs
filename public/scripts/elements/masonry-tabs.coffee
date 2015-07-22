$ = require 'jquery'
_ = require 'underscore'

Backbone = require '../utils/backbone.coffee'
imagesLoaded = require 'imagesloaded'
Masonry = require 'masonry-layout'

Tabs = require './tabs.coffee'

MasonryTabs = Tabs.extend

    _selectors: ()->
        _.defaults {
            "tab-item": '.js-tab'
            "masonry": '.panel__body .js-masonry-js'
            "masonry-item": '.js-masonry-item'
        }, this._super();

    _classes: ()->
        _.defaults {
            "animated": 'animated'
        }, this._super();

    _initTabs: ()->
        this._super()

        this._elem('tab-item').on 'shown.bs.tab', (e) =>
            control = $(e.target)
            msnr = $(control.attr('href')).find(this._selector 'masonry')
            if msnr.length and !msnr.data('init')
                imagesLoaded msnr, =>
                    new Masonry msnr.get(0),
                        itemSelector: this._selector 'masonry-item'
                        isAnimated: "true",

                    msnr.find(this._selector('masonry-item')).addClass this._class('animated')

                msnr.data 'init', true

module.exports = MasonryTabs
