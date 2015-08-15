$ = require 'jquery'
_ = require 'underscore'

WithImages =

    _classes: ()->
        _.defaults {
            "loaded": 's_image__loaded'
        }, this._super()

    _selectors: ()->
        _.defaults {
            "image": '.js-image'
        }, this._super()

    initialize: ()->
        @._super()

        this._elem('image').each (i, el) =>
            $(el).attr 'src', $(el).data('src')
            el.onload = ()=>
                $(el).addClass this._class('loaded')
            el.onerror = ()=>
                $(el).attr 'src', $(el).data('absent')
                $(el).addClass this._class('loaded')


module.exports = WithImages
